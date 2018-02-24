# Sparkling

Sparkling is a general fuzzy finder. It is different from the atom built-in one in that I tried to build it totally customisable. It's responsability is to filter data, not to provide it.

## Install

Download this package from the atom package list. This package relies heavily on other programs from which it can create data sources. I recommend installing ag and ripgrep and including it in your path:

https://github.com/BurntSushi/ripgrep

https://github.com/ggreer/the_silver_searcher

## Keybindings

This package comes with a lot of Keybindings. I have tried my best to accomodate them semantically without disturbing native atom Keybindings. However, if this does not suit you, you can disable them in the package settings and create your own. Also, the table below is valid for windows/linux by using ctrl instead of cmd.

| Command                      | Keybinding              | Data source           | On activate     |
| ---------------------------- | ----------------------- | --------------------- | --------------- |
| sparkling:files              | cmd-p cmd-p             | ripgrep project files | go to           |
| sparkling:gitFiles           | cmd-g cmd-f             | git status            | go to           |
| sparkling:gitStage           | cmd-g cmd-s             | git status            | stage / unstage |
| sparkling:gitCheckout        | cmd-g cmd--             | git status            | checkout --     |
| sparkling:gitBranches        | cmd-g cmd-b             | git branches          | checkout        |
| sparkling:gitLog             | cmd-g cmd-l             | git log               | copy git hash   |
| sparkling:gitLogCheckout     | cmd-g cmd-L             | git log               | checkout        |
| sparkling:gitReflog          | cmd-g cmd-r             | git reflog            | copy git hash   |
| sparkling:gitReflogCheckout  | cmd-g cmd-R             | git reflog            | checkout        |
| sparkling:allLines           | cmd-l cmd-L             | ripgrep project lines | go to           |
| sparkling:ls                 | cmd-l cmd-s             | ls                    | go to / dive    |
| sparkling:removeFiles        | cmd-p cmd-D             | ripgrep project files | rm              |
| sparkling:copyFiles          | cmd-p cmd-c             | ripgrep project files | cp              |
| sparkling:moveFiles          | cmd-p cmd-m             | ripgrep project files | mv              |
| sparkling:findToggle         | cmd-p cmd-f enter       | ag pattern in project | go to           |
| sparkling:findInBufferToggle | cmd-b cmd-f enter       | ag pattern in buffer  | go to           |
| sparkling:findToggle         | cmd-p cmd-f shift-enter | ag pattern in project | replace         |
| sparkling:findInBufferToggle | cmd-b cmd-f shift-enter | ag pattern in buffer  | replace         |

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
