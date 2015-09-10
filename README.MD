Oh no **Not Another** PubSub in javascript.

YES, another pubsub in javascript. Basically, it's what i have been accustomed to, so instead of learning new other pubsubs,
i'll re use this one over and over again.

It's light and uses publish/subscribe as their function names.

### How to use ###
```html
<script src="notanotherpubsub.min.js"></script>
```

```javascript
subscribe("basic", function(){ /*do something*/ });
subscribe("basic", function(){ /*do something*/ });
publish("basic")

subscribe("withArgs", function(a,b,c){ /*do something with a b c*/ });
subscribe("withArgs", function(a,b,c){ /*do something with a b c*/ });
publish("withArgs",["a","b","c"])

subscribe("withThis", function(){ /*do something with this*/ });
subscribe("withThis", function(){ /*do something with this*/ });
publish("withArgs",null, valueForThis)

//recent update - this now works
publish("every-good-boy-does-fine", ["father-always-comes-early"] )
subscribe("every-good-boy-does-fine", function(a){ /* a == 'father-always-comes-early' */ } )
```
