grammar MessTy

entry Model:
    (message+=Message | type+=Type )*;

Type:
    'type' name=ID Block;

Message:
    'message' name=ID Block;

Param: name=ID;

fragment Block: '{' body+=TypeAssignment* '}';

TypeAssignment:
    name=ID ':' (type=PrimitiveType | typeRef=[Type:ID]) ';';



PrimitiveType: 
    type=('string' | 'number' | 'boolean' );



hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

