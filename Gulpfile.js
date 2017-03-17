var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	TypeScript = require('typescript'),
	sourcemaps = require('gulp-sourcemaps'),
	tslint = require('gulp-tslint'),
	merge = require('merge2'),
	server = require('gulp-develop-server'),
	livereload = require('gulp-livereload'),
	vinylPaths = require('vinyl-paths'),
	del = require('del'),
	install = require('gulp-install');

var serverProject = ts.createProject({
	declarationFiles: true,
	noResolve: false,
	target: 'ES6',
	module: 'commonjs',
	typescript: TypeScript
});

var tsLintConfigured = function() {
	return tslint({
		configuration: {
			rules: {
				/* List all rules here */
				'ban': true,
				'class-name': true,
				'curly': true,
				'eofline': true,
				'forin': true,
				'indent': true,
				'interface-name': true,
				'label-position': true,
				'no-construct': true,
				'no-duplicate-variable': true,
				'no-eval': true,
				'no-switch-case-fall-through': true,
				'trailing-comma': [true,
					{
						'multiline': 'never',
						'singleline': 'never'
					}
				],
				'no-trailing-whitespace': true,
				'no-unused-expression': true,
				'no-use-before-declare': true,
				'one-line': [true,
					'check-open-brace',
					'check-whitespace'
				],
				'semicolon': true,
				'triple-equals': true,
				'whitespace': [true,
					'check-branch',
					'check-decl',
					'check-operator'
				]
			}
		}
	});
}

function tslintReporter(output, file, options) {
	gutil.log(gutil.colors.cyan('tslint'),file.path);
	var path = file.path;
	output.forEach(function(m) {
		console.log(
			gutil.colors.yellow("tslint "+path+":"+(m.startPosition.line+1)+":"+(m.startPosition.character+1)+":")+
			gutil.colors.red(m.failure),
			gutil.colors.magenta(" ("+m.ruleName+")")
		);
		notifier.notify({
			title: 'tslint '+path+':'+(m.startPosition.line+1),
			message: m.failure
		});
	});
}

var gotError = false;

function plumberErr() {
	return plumber({
		errorHandler: function() {
			gotError = true;
		}
	})
}
function resetErr() {
	gotError = false;
}
function isErr() {
	return gotError;
}

var compileServer = function() {
	var tsresults = gulp.src('server/src/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(tsLintConfigured())
		.pipe(tslint.report(tslintReporter, {}))
		.pipe(serverProject());
	return merge([
		tsresults.dts.pipe(gulp.dest('server/definitions')),
		tsresults.js.pipe(sourcemaps.write()).pipe(gulp.dest('server/lib'))
	]);
}


gulp.task('reset_error', function() {
	resetErr();
});

gulp.task('compile:server', function() {
	return compileServer();
});


gulp.task('compile', [
	'compile:server'
]);

gulp.task('server:restart', function() {
	compileServer()
	.pipe(
		server({
			path: 'server/lib/server.js'
		}))
	.pipe(
		livereload()
	);
});


gulp.task('develop', ['server:restart'], function(){
	gulp.watch('server/src/**/*.ts', ['server:restart']);
});


gulp.task('install', function() {
	gulp.src(['./package.json'])
	.pipe(install());
});


/** Careful!
 * This deletes all generated files */
gulp.task('distclean', function() {
	return gulp.src([
		'./node_modules',
		'./server/definitions',
		'./server/lib',
		'./server/typings'
	], {read:false})
	.pipe(vinylPaths(del))
	;
});


gulp.task('default', ['compile']);
