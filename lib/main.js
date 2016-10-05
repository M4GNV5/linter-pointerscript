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

						var errors = [];
						if(data)
						{
							data = data.split("\n\n");
							var split = data[1].trim().split("\n");
							var range = [
								[parseInt(split[1]) - 1, parseInt(split[2]) - 1],
								[parseInt(split[3]) - 1, parseInt(split[4]) - 1]
							];
							errors.push({
								type: "Error",
								text: data[0].trim(),
								filePath: split[0],
								range: range
							});
						}
						resolve(errors);
					});
				});
			}
		};
	}
};
