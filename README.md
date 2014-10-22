Glob (SilexJS)
========

Simple globber, searches for all the pathnames matching pattern according to the rules used.

Package owned [SilexJS](https://github.com/silexjs/silex).

Install
--------

```bash
$ npm install silex-glob
```

Usage
--------

```javascript
var glob = require('silex-glob');

var list = glob('**/*.js', function(filePath) {
	// Reads all the files with the extension "js" in the current folder and all subfolders (recursive)
});
// And the variable "list" returns an array with the list of found files
```

Doc
--------

### glob(rules, [callback])

* `rules` {String|Array|Object}
  * The rule can contain regular expressions, but she needs to be enclosed in parentheses
    * Example valid: `./**/*.(js|node)` or `./**/*.mp([2-4])` or ...
    * Exemple incorrecte: `./**/*.mp[2-4]` (`[2-4]` is not in parentheses)
  * `String` Search rule
  * `Array` List of search rules
  * `Object` List of search rules as Object *(the "excludes" parameter is not yet functional)*
    ```javascript
    {
        includes: ['./**/*.(js|node)', './**/*.mp([2-4])'],
        excludes: [],
    }
    ```
* `callback` {Function}
  * Callback function is called each time a file is found.
    If the function returns false, then the file is not added to the list returned by Glob, otherwise it is added.
