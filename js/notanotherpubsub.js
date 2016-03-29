!function(){
var topics      = {}    // Dictionary of all topics
var publist     = {}    // Dictionary of all published topics to allow late subscriptions to get published
var func_index  = {}    // Index of optional_id's, used for removing functions
var ID_SERIAL   = 1     // incemented for every subscriber
window.subscribe = subscribe
window.publish = publish

function Topic(){
  this.subscribers = []
  this.subscribe = function( subscriber ){
    this.subscribers.push( subscriber )
  }

  this.publish = function( data ){
    for( var i=0; i< this.subscribers.length; i++){
      var sub = this.subscribers[i]
      sub.execute(data)
    }
  }
}

Topic.topics = {}
Topic.get = function( topic ){
  var temp = Topic.topics[ topic ]
  if( !temp ){
    // If not exists then create it
    // then save it
    temp = new Topic(topic)
    Topic.topics[ topic ] = temp
  }
  return temp
}

function Subscriber(){
  // Funcs
  this.subscribe  = subscribe
  this.execute    = execute

  // Fields
  this.id         = ID_SERIAL++ // Generated on subscription
  this.isStarted  = true

  function execute(data){
    if( this.isStarted )
      this.callback.apply(null,data)
  }

  function subscribe(topic,callback){
    this.topics   = topic instanceof Array  ? topic.sort() : new Array(topic)
    this.callback = callback

    var subscriber = this
    this.topics.forEach(function( topic, index ){
      var instance = Topic.get( topic )
      instance.subscribe( subscriber )
    })
  }

  function stop(){
    this.isStarted = false
  }

  function start(){
    this.isStarted = true
  }
}


function subscribe(topic,callback){     // Basic subscribe interface
  var sub = new Subscriber()
  sub.subscribe( topic,callback )

  return sub
}

function publish(topic,data){
  var instance = Topic.get( topic )
  instance.publish(data)
}


}()
