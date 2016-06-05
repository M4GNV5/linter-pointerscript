var execFile = require("child_process").execFile;
var file = __dirname + "/ptrs_check";
//gcc --std=gnu99 '-DINTERPRETER_INCLUDE="../../lib/syntaxCheck.h"' ../PointerScript/parser/ast.c syntaxCheck.c -o ptrs_check

module.exports = {
	provideLinter: function()
	{
		return {
			name: "PointerScript",
			grammarScopes: ["source.ptrs"],
			scope: "file",
			lintOnFly: false,
			lint: function(editor)
			{
				return new Promise(function(resolve, reject)
				{
					execFile(file, [editor.getPath()], function(err, data)
					{
						if(err)
							throw err;

						var split = data.trim().split("\n");
						var errors = [];

						for(var i = 0; i < split.length - 3; i += 4)
						{
							var line = parseInt(split[i + 2]) - 1;
							var column = parseInt(split[i + 3]) - 1;
							errors.push({
								type: "Error",
								text: split[i],
								filePath: split[i + 1],
								range: [[line, column], [line, column + 1]]
							});
						}
						resolve(errors);
					});
				});
			}
		};
	}
};
