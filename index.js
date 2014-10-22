var path = require('path');
var fs = require('fs');


var glob = function(rulesParam, callback) {
	if(rulesParam instanceof Object === true && rulesParam instanceof Array === false) {
		rules = rulesParam;
	} else {
		rules = {
			includes: [],
			excludes: [],
		};
		if(rulesParam instanceof Array === true) {
			rules.includes = rulesParam;
		} else if(typeof rulesParam === 'string') {
			rules.includes = [rulesParam];
		}
	}
	if(callback === undefined) {
		callback = function() {};
	}
	
	var dirs = {};
	for(var i in rules.includes) {
		var rule = rules.includes[i];
		
		var regularPath = rule.substr(0, rule.search(/(\(|\[|\*)/));
		regularPath = regularPath.substr(0, regularPath.lastIndexOf('/'));
		rule = rule.substr(regularPath.length).replace(/^\//, '');
		regularPath = path.resolve(regularPath).replace(/\\/g, '/');
		
		var save = [];
		var open = 0;
		var start = 0;
		for(var ii in rule) {
			ii = parseInt(ii);
			if(rule[ii] == '(') {
				if(open == 0) { start = ii; }
				open++;
			} else if(rule[ii] == ')') {
				open--;
				if(open == 0) {
					save.push(rule.substr(start, ii-start+1));
					var ruleStart = rule.substr(0, start);
					var ruleEnd = rule.substr(ii+1);
					rule = ruleStart+'<'+(save.length-1)+'>'+ruleEnd;
				}
			}
		}
		
		rule = rule
				.replace(/\*\*\//g, '<F>')
				.replace(/\*/g, '<S>')
				
				.replace(/(\.|\/|\\|\^|\$|\{}|\[]|\*|\+|\?|\||\-|\&)/g, '\\$1')
				
				.replace(/\<F\>/g, '(.*\/?)')
				.replace(/\<S\>/g, '([^\/]*)');
		
		for(var ii in save) {
			rule = rule.replace('<'+ii+'>', save[ii]);
		}
		
		rule = new RegExp('^'+rule+'$');
		
		if(dirs[regularPath] === undefined) {
			dirs[regularPath] = [rule];
		} else {
			dirs[regularPath].push(rule);
		}
	}

	var files = [];
	var readDir = function(dirPath, regexs, basePath) {
		var contents = fs.readdirSync(dirPath+'/'+basePath);
		for(var i in contents) {
			var contentPath = dirPath+'/'+basePath+contents[i];
			if(fs.lstatSync(contentPath).isFile() === true) {
				for(var ii in regexs) {
					if(regexs[ii].test(basePath+contents[i]) === true) {
						if(callback(contentPath) !== false) {
							files.push(contentPath);
						}
						break;
					}
				}
			} else {
				readDir(dirPath, regexs, basePath+contents[i]+'/');
			}
		}
	}
	for(i in dirs) {
		readDir(i, dirs[i], '');
	}
	
	return files;
};

module.exports = glob;
