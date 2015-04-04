# Graphen

A Firefox extension to visualise your history as a graph


## Setup

Install the [Firefox add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation).


## Building

To build the XPI (add-on installation file):

```
cfx xpi
```

## Automated Building and Deployment

Install the necessary dev dependencies

```
node install
```

Install the [Extension Auto-Installer](https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/).

Run grunt. This will watch for any file changes and deploy them to firefox.

```
grunt
```

Change and save a file and it will be automatically updated. 

## Testing

To manually test the add-on:

```
cfx run
```

To run the unit tests:

```
cfx text
```