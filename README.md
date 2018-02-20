# Sparkling

Sparkling is a general fuzzy finder. It is different from the atom built-in one in that I tried to build it totally customisable. It's responsability is to filter data, not to provide it.

## Install

Download this package from the atom package list. This package relies heavily on other programs from which it can create data sources. I recommend installing ag and ripgrep and including it in your path:

https://github.com/BurntSushi/ripgrep
https://github.com/ggreer/the_silver_searcher

## Default commands

| Keybinding                       |       Data source        |                 activate |
| -------------------------------- | :----------------------: | -----------------------: |
| `cmd-p`                          | ripgrep files in project |                open file |
| `cmd-shift-a` then `enter`       |  ag pattern in project   |       go to line in file |
| `cmd-shift-a` then `shift-enter` |  ag pattern in project   |          replace in file |
| `cmd-l` + `cmd-L`                | ripgrep lines in project |       go to line in file |
| `cmd-l` + `cmd-a`                | ripgrep lines in project |              insert text |
| `cmd-l` + `cmd-l`                |   current buffer lines   |               go to line |
| `cmd-g cmd-p`                    |        git status        |                open file |
| `cmd-g cmd-s`                    |        git status        |       stage/unstage file |
| `cmd-g cmd-b`                    |       git branches       |          checkout branch |
| `cmd-l cmd-s`                    |            ls            | open file or dive folder |

`cmd-p` defaults to disabled since you need `ripgrep` in your path and I do not want to make it look like the plugin is broken.

## Find files

![](https://raw.githubusercontent.com/germtb/gifs/master/findFiles.gif)

## Find pattern

![](https://raw.githubusercontent.com/germtb/gifs/master/find.gif)

## Replace pattern

![](https://raw.githubusercontent.com/germtb/gifs/master/replace.gif)

## Find project lines

![](https://raw.githubusercontent.com/germtb/gifs/master/findProjectLines.gif)

## ls navigation

![](https://raw.githubusercontent.com/germtb/gifs/master/ls.gif)

## Find lines in buffer

![](https://raw.githubusercontent.com/germtb/gifs/master/findLine.gif)

## Autocomplete lines

![](https://raw.githubusercontent.com/germtb/gifs/master/autocompleteLines.gif)

## git status

![](https://raw.githubusercontent.com/germtb/gifs/master/gitFiles.gif)

## git stage

![](https://raw.githubusercontent.com/germtb/gifs/master/gitStage.gif)

## git branches

![](https://raw.githubusercontent.com/germtb/gifs/master/gitBranches.gif)

## Plugin service interface

You can build a plugin with your own sources, just like I show in this example project: https://github.com/germtb/sparkling-extras

As you can see I provide a `h` instance from preact and a redux `store` so that you can interact with sparkling and even create your own view for it.
