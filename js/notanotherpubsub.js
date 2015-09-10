!function(){
var topics = {};
var publist = {}
window.subscribe = subscribe
window.publish = publish

function subscribe(topic,func){
    if( topic instanceof Array ) {
        var topics = topic.sort()
        pubsub_multi_subscribe(topics,func);
    }
    else{
        pubsub_single_subscribe(topic,func);
    }
}
        

function pubsub_single_subscribe(topic,func){
    if( topic in  publist ){
        var item = publist[topic]
        func.apply( item.valueForThis,item.args);
    } 
    
    var temp = topics[topic];
    if( !temp ) temp = topics[topic] = [];
    temp.push( func );
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
        pubsub_single_subscribe( call_topic, func );
        
        /**
         * Subscribe to all the topics just to
         * increment the counter
         */
        for(var i = 0; i < topics.length; i++){
            !function(){
                var topic = topics[i];
                pubsub_single_subscribe(topic, function(){
                    //log.trace("Pubsub Merge Counter ++ for topic: " + call_topic);
                    call_args[ topic ] = arguments;
                    call_counter++;
                    if( call_counter == topics.length ){
                        $.vts.publish(call_topic, call_args);
                    }
                });
            }();//anonymous scoping function;
        }
    }();
}//func pubsub_multi_subscribe
    
function publish(topic,args,valueForThis){
    var topic = topic.trim();
    var temp = topics[topic];
    publist [ topic ] = {args:args,valueForThis:valueForThis}
    if( temp ){
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

    
    
}()     

    
    
    
