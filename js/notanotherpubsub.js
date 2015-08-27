//pubsub
    var topics = {};
    subscribe = function(topic,func){
            if( topic instanceof Array ){
                pubsub_multi_subscribe(topic,func);
            }else{
                pubsub_single_subscribe(topic,func);
            }
            
        };

        
    function pubsub_single_subscribe(topic,func){
        var temp = topics[topic];
        if( !temp ) temp = topics[topic] = [];
        temp.push( func );
    }//func pubsub_single_subscribe
    
    function pubsub_multi_subscribe(topics,func){
        !function(){
            var call_func = func;
            var call_topic = "__callback__:" + topics.join("+");
            var call_counter = 0;
            var call_args = {};
            window.cargs = call_args;
            /**
             * Subscribe original function to generated key
             */
            // log.trace("Pubsub Merge Call Topic Generated: " + call_topic);
            pubsub_single_subscribe( call_topic, func );
            
            /**
             * Subscribe to all the topics just to
             * increment the counter
             */
            for(var i = 0; i < topics.length; i++){
                !function(){
                    var topic = topics[i];
                    pubsub_single_subscribe(topic, function(){
                        // log.trace("Pubsub Merge Counter ++ for topic: " + call_topic);
                        call_args[ topic ] = arguments;
                        call_counter++;
                        if( call_counter == topics.length ){
                            publish(call_topic, call_args);
                        }
                    });
                }();//anonymous scoping function;
            }
        }();
    }//func pubsub_multi_subscribe
    
    publish = function(topic,args,valueForThis){
            var topic = topic.trim();
            var temp = topics[topic];
            if( temp ){
                // log.debug("Publishing topic `" + topic + "` containing ", temp.length + " functions ");
                
                if( args ){
                    if( !(args instanceof Array) ){
                        args = [args];
                    }
                }else{
                    args = [];
                }
                if( !valueForThis ) valueForThis = null;
                for( var x=0;x<temp.length;x++)
                    temp[x].apply(valueForThis,args);

            }else{
                // log.debug("Publishing topic ` " + topic + "` containing :", "0 functions ");
            }
        };