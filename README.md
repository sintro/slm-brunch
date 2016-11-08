## Slm-brunch

Adds [Slm](https://github.com/slm-lang/slm) templates support to [brunch](http://brunch.io). The Slm template engine is Node.js version of Ruby\`s Slim.

This plugin can make only static assets compiling (which are in app/assets). Just make valid slim-templates, call it "something**.slim**" or "something**.slm**" and it will be compiled at /public. Of course, there is no sence in trying to embed any locals output in templates, because it is static pages, but it is possible to make a kind of "global" variables for this plugin in its config, which can be rendered in static html pages using Slim syntax (soon). 

One more thing you should know: there is no way to make "pretty" HTML in original **slm-lang** engine (look [here](https://github.com/slm-lang/slm/issues/23)), so all outputted static html-files will be minified. Probably, this can be fixed using some external node.js plugin.

## TODO

- [ ] Add some typical config options (files patterns, global locals, etc)
- [ ] Check hot-reloading (probably does not work now)
- [ ] Add the possibility of getting pretty HTMLs
- [ ] Add js-templates support
- [ ] Or even some direct integration with Slm-lang (without prerendering)? Dont know now if it makes sence.
- [ ] Add tests?
- [ ] Publish in NPM 

## Installation

Add `"slm-brunch": "x.y.z"` to `package.json` of your brunch app **(not published on npm now!)**.

If you want to use git version of plugin, add
`"slm-brunch": "git+https://github.com/sintro/slm-brunch.git"`.

## Work progress

I did this early release just to get some help from community on implementing of Slm integration into Brunch. This plugin almost was not tested and refactored. See *Commits*

## Credits

Thanks to many other Brunch plugins for samples and sources ;)

## Commits

Feel free to make forks and PRs, I think many of current TODOs can be solved really easy by you!