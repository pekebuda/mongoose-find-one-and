/***************************************************************************
 * @description
 * 
 * @param {Object} query: propiedades (pares clave-valor) con que ejecutar 
 * la busqueda del elemento en MongoDB. 
 * @param {Array} methodArguments: valores pasados como argumentos al metodo 
 * de instancia invocado (incluyendo posiblemente un callback exigible por 
 * dicho metodo)
 * 
 * @return {Error || Mixed}: 
 ***************************************************************************/
var _               = require('lodash');



module.exports = function(schema, options){
    const METHOD_NAME = options.methodName;
    const STATIC_NAME = 'findOneAnd' + _.upperFirst(METHOD_NAME);
    schema.statics[STATIC_NAME] = findOneAnd;
    
    
    
    function findOneAnd(query, methodArguments){
        const CALLBACK = _.isFunction(_.last(METHOD_ARGUMENTS))? _.last(METHOD_ARGUMENTS): null;
        this.findOne(query)
            .exec(function(e, r){
                    if (e) { 
                        if (CALLBACK) {return CALLBACK(e, null)} 
                        else {throw e} 
                    } else if (r === null) {
                        if (CALLBACK) {return CALLBACK(new Error("MismatchError querying from " + STATIC_NAME + " with value " + query), null) } 
                        else {throw new Error("MismatchError querying from " + STATIC_NAME)}
                    } else { 
                        return r[METHOD_NAME].apply(r, METHOD_ARGUMENTS);
                    }
                }
            );
    }
};