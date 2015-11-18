!function(){
var topics      = {}    // Dictionary of all topics
var publist     = {}    // Dictionary of all published topics to allow late subscriptions to get published
var func_index  = {}    // Index of optional_id's, used for removing functions
window.subscribe = subscribe
window.publish = publish
window.unsubscribe = unsubscribe

/**
* @return Id of the subscription 
*/
function subscribe(topic,func,optional_id){     // Basic subscribe interface
    
    var sub_index
    if( topic instanceof Array ) {
        var sorted_topics = topic.sort()
        sub_info = pubsub_multi_subscribe(sorted_topics,func);
    }
    else{
        sub_info = pubsub_single_subscribe(topic,func);
    }

    func_index[ optional_id || sub_info.id ] = sub_info
    return sub_info.id
}
        

function pubsub_single_subscribe(topic,func){
    if( topic in  publist ){
        var item = publist[topic]
        func.apply( item.valueForThis,item.args);
    } 
    
    var temp         = topics[topic];
    if( !temp ) temp = topics[topic] = [];
    var new_index    = topics[topic].length
    temp.push( func );

    //return the index of the newly inserted function
    return {
        index: new_index,
        topic: topic,
        id: topic + topics[topic].length
    }    
}//func pubsub_single_subscribe
    

function pubsub_multi_subscribe(topics,func){
    !function(){
        var call_func = func
        var call_topic = "__callback__:" + topics.join("+")
        var call_counter = 0
        var call_args = {}
        window.cargs = call_args
        /**
         * Subscribe original function to generated key
         */
        //log.trace("Pubsub Merge Call Topic Generated: " + call_topic);
        var sub_info = pubsub_single_subscribe( call_topic, func );
    
        /*
         * Subscribe to all the topics just to
         * increment the counter
         */
        for(var i = 0; i < topics.length; i++){
            !function(){
                var topic   = topics[i];
                pubsub_single_subscribe(topic, function(){
                    //log.trace("Pubsub Merge Counter ++ for topic: " + call_topic);
                    call_args[ topic ] = arguments;
                    call_counter++;
                    if( call_counter == topics.length ){
                       publish(call_topic, call_args);
                    }
                });
            }();//anonymous scoping function;
        }
        return sub_info
    }();
}//func pubsub_multi_subscribe
    
function publish(topic,args,valueForThis){
    var topic = topic.trim();
    var temp = topics[topic];
    publist [ topic ] = {args:args,valueForThis:valueForThis}

    if( temp  && temp.length  ){
        //log.debug("Publishing topic `" + topic + "` containing ", temp.length + " functions ");
        if( args ){
            if( !(args instanceof Array) ){
                args = [args];
            }
        }else{
            args = [];
        }
        if( !valueForThis ) valueForThis = null;
        var return_result = true;
        for( var x=0;x<temp.length;x++){
            if( !temp[x] ) continue
            return_result = temp[x].apply(valueForThis,args);
            if( return_result === false ){
                return false;
            }
        }
        return return_result;               
    }else{
        //log.debug("Publishing topic `" + topic + "` containing :", "0 functions ");
    }
};

function unsubscribe(id){
    var target = func_index[ id ]
    var old_func = topics[ target.topic ][target.index]
    topics[ target.topic ][target.index] = null

    return old_func
}

    
    
}()     

    
    
    
