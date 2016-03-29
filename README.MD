Oh no **Not Another** PubSub in javascript.

YES, another pubsub in javascript. Basically, it's what i have been accustomed to, so instead of learning new other pubsubs,
i'll re use this one over and over again.

It's light and uses publish/subscribe as their function names.


### What is it for mainly? ###
It's mainly for very basic pub|sub operations. This ~0.7KB-ish file can help
organize your scripts.

### Update Notes ###
* 3/30/2016 - Refactored code into classes. Also removed quite a few features.
The features removed were out of this code's scope. I've decided that
this should remain as a very basic pubsub. Nothing more.

### FAQ ###

#### Can i use it for dependency injection ####
Don't. The pubsub has no control over instantiation, and the number of times
it is published. The weight of the burden is transferred to the developer.

Unless you know what you are doing.

#### Can i use to to replace events ####
A bit but not really. The publish method does not really have any clue as to where the publish was
performed or through what action. If that doesn't matter then sure you can.

You can also pass an event as a parameter to the publish.

#### So why in the world would i use this? ####
For the small use case that you need a repetitive action that is decoupled from the caller,
or the scope of the caller.

### Basic Examples ###
```html
<script src="notanotherpubsub.min.js"></script>
<div id='counter'>0</div>
<button on-click="publish('addCounter')"><button>
```

```javascript
var ctr = 0
subscribe("addCounter", function(){
	ctr++
	document.getElementById('counter').innerHTML = ctr
})
```
