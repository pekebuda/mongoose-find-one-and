var _               = require('lodash');



module.exports = function(schema, options){
    const METHOD_NAME = options.methodName;
    const STATIC_NAME = 'findOneAnd' + _.upperFirst(METHOD_NAME);
    schema.statics[STATIC_NAME] = findOneAnd;
    
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
     */
    function findOneAnd(query, methodArguments){
        this
            .findOne(query)
            .exec(function(e, r){
                    if (e) { return cb(e, null) }
                    else if (r === null) { return cb(new Error("MismatchError querying from " + STATIC_NAME), null) } 
                    else { return r[METHOD_NAME].apply(r, methodArguments) }
                }
            );
    }
};