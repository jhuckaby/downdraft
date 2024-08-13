#!/usr/bin/env node

// downdraft
// Convert Markdown source to rich HTML in your clipboard.
// Currently only works on macOS.
// Copyright (c) 2024 Joseph Huckaby, PixlCore.com, MIT Licensed

const fs = require('fs');
const os = require('os');
const cp = require('child_process');
const marked = require('marked');
const juice = require('juice');
const hljs = require('highlight.js');
const he = require('he');

if (os.platform() !== 'darwin') {
	throw new Error("Sorry, this tool only works on macOS.");
}

const Args = require('pixl-args');
var args = (new Args({})).get();

const PBCOPY_BIN = '/usr/bin/pbcopy';
const PBPASTE_BIN = '/usr/bin/pbpaste';
const OSASCRIPT_BIN = '/usr/bin/osascript';

const marked_config = {
	"gfm": true,
	"tables": true,
	"breaks": false,
	"pedantic": false,
	"sanitize": false,
	"smartLists": true,
	"smartypants": false,
	"silent": true,
	"headerIds": false,
	"mangle": false
};

process.chdir( __dirname );

// prepare css
var css = '';
css += fs.readFileSync('css/base.css', 'utf8');
css += fs.readFileSync('css/style.css', 'utf8');
css += fs.readFileSync('css/email.css', 'utf8');
css += fs.readFileSync('node_modules/highlight.js/styles/github-gist.css', 'utf8');

// inline all CSS variables, because juice apparently doesn't
var css_vars = {};

// strip dark theme
css = css.replace(/body\.dark\s*\{[^\}]*\}/, '');

// --blue: #007bff;
// --theme-color-highlight: rgb(80, 170, 255);
css = css.replace(/(\-\-[\w\-]+)\:\s*([^\;]*)\;/g, function(m_all, key, value) {
	css_vars[key] = value;
	return '';
});

// background: var(--background-color);
css = css.replace(/var\((\-\-[\w\-]+)\)/g, function(m_all, key) {
	return css_vars[key] || key;
});

// get clipboard contents as plain text (markdown source)
cp.exec( PBPASTE_BIN, function(err, md, stderr) {
	if (err) throw err;
	
	var marked_html = marked(md, marked_config);
	marked_html = he.decode(marked_html);
	
	// format code blocks
	// <pre><code class="language-js"> ... </code></pre>
	marked_html = marked_html.replace( /<pre><code class="([\w\-]+)">([\S\s]+?)<\/code><\/pre>/g, function(m_all, lang, code) {
		lang = lang.replace(/^language-/, '');
		
		var results = hljs.highlight( lang, code, true );
		if (!results || !results.value) results = { value: code };
		return '<pre><code>' + results.value + '</code></pre>';
	} );
	
	var html = '';
	
	// add compiled css needed for e-mail (we remove this later)
	html += '<style>' + css + '</style>';
	
	// outer wrapper div with global font styles
	html += '<div class="email_wrapper">';
	
	html += '<div class="markdown-body">' + marked_html + '</div>';
	
	html += '</div>'; // outer wrapper
	
	// call juice to do the needful
	var juiced_html = juice(html, {});
	
	// juice does not remove the original style tags, sigh
	// (yes, I know about `removeStyleTags`, it doesn't WORK)
	juiced_html = juiced_html.replace(/<style>[\s\S]+<\/style>/, '');
	
	if (args.debug) {
		// debug mode: just dump HTML to STDOUT and exit
		console.log(juiced_html);
		process.exit(0);
	}
	
	// convert HTML to hex stream because AppleScript is bizarre 🤷‍♂️
	var hex = Buffer.from(juiced_html).toString("hex");
	var script_content = "set the clipboard to «data HTML" + hex + "»";
	
	// write temp script file so we don't blow out the command-line
	var temp_file = os.tmpdir() + '/downdraft-' + process.pid + '.txt';
	fs.writeFileSync( temp_file, script_content );
	
	// run script to write to clipboard
	cp.exec( OSASCRIPT_BIN + " " + temp_file, function(err, stdout, stderr) {
		
		// always cleanup temp file
		fs.unlinkSync( temp_file );
		
		if (err) throw err;
		process.exit(0);
	}); // osascript
}); // pbpaste
