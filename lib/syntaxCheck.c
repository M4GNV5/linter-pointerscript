#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <stdbool.h>
#include <ctype.h>
#include "../PointerScript/parser/ast.h"

int line = 1;

int main(int argc, char **argv)
{
	if(argc != 2)
	{
		fprintf(stderr, "Usage: ptrs_check <file>");
		return EXIT_FAILURE;
	}

	FILE *fd = fopen(argv[1], "r");

	if(fd == NULL)
	{
		fprintf(stderr, "Failed to open file %s\n", argv[1]);
		return EXIT_FAILURE;
	}

	fseek(fd, 0, SEEK_END);
	long fsize = ftell(fd);
	fseek(fd, 0, SEEK_SET);

	char *src = malloc(fsize + 1);
	fread(src, fsize, 1, fd);
	fclose(fd);
	src[fsize] = 0;

	ptrs_parse(src, argv[1], NULL);
	return EXIT_SUCCESS;
}

void logParseError(ptrs_ast_t *ast, const char *msg, ...)
{
	va_list ap;
	va_start(ap, msg);
	vprintf(msg, ap);
	va_end(ap);

	int i;
	int column = 1;
	for(i = 0; i < ast->codepos; i++)
	{
		if(ast->code[i] == '\n')
		{
			line++;
			column = 1;
		}
		else
		{
			column++;
		}
	}

	bool startIsAlnum = isalnum(ast->code[ast->codepos]);
	bool startIsPunct = ispunct(ast->code[ast->codepos]);
	for(i = ast->codepos + 1; true; i++)
	{
		if(startIsAlnum && isalnum(ast->code[i]))
			;
		else if(startIsPunct && ispunct(ast->code[i]))
			;
		else
			break;
	}
	i -= ast->codepos - column;

	printf("\n\n%s\n%d\n%d\n%d\n%d\n", ast->file, line, column, line, i);
	exit(EXIT_SUCCESS);
}
