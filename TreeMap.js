//##########################################################
//#### MapElement
//#### @Massimo Candela
//#### webrobotics.net
//##########################################################

var net = net || {};
net.webrobotics = net.webrobotics || {};

net.webrobotics.MapElement=function(key){
    this.key=key;
    this.next;
    this.prev;
    this.values=new Array();
    this.last=0;
}

net.webrobotics.MapElement.prototype.getKey=function(){
    return this.key;
}

net.webrobotics.MapElement.prototype.addValue=function(val){
    this.values[this.last]=val;
    this.last++;
}

net.webrobotics.MapElement.prototype.setNext=function(next){
    this.next=next;
}

net.webrobotics.MapElement.prototype.setPrev=function(prev){
    this.prev=prev;
}

net.webrobotics.MapElement.prototype.getNext=function(){
    return this.next;
}

net.webrobotics.MapElement.prototype.getPrev=function(){
    return this.prev;
}

net.webrobotics.MapElement.prototype.getValues=function(){
    return this.values;
}

//##########################################################
//#### Comparator for bgplay.js
//#### @Massimo Candela
//#### webrobotics.net
//##########################################################

function Comparator(){
}

Comparator.prototype.compare=function(obj1,obj2){
    if (obj1.getKey()<obj2.getKey())
        return -1
    else if (obj1.getKey()>obj2.getKey())
        return 1
    else return 0;
}

//##########################################################
//#### TreeMap
//#### @Massimo Candela
//#### webrobotics.net
//##########################################################
/*
 Complexity

 insert:
 best: O(1) in loco
 average: O(log n) non in loco
 worst: O(log n) non in loco

 search:
 best: O(1)
 average: O(log n)
 worst: O(log n)

 delete:
 best: O(1) non in loco
 average: O(log n) non in loco
 worst: O(log n) non in loco

 */

net.webrobotics.TreeMap=function(comparator){
    this.elements=new Array();
    this.comparator=comparator;
}

net.webrobotics.TreeMap.prototype.size=function(){
    return this.elements.length;
}

net.webrobotics.TreeMap.prototype.last=function(){
    return this.elements[this.size()-1];
}

net.webrobotics.TreeMap.prototype.first=function(){
    return this.elements[0];
}

net.webrobotics.TreeMap.prototype.put=function(key,value){
    var element=new net.webrobotics.MapElement(key);
    element.addValue(value);

    if (this.size()==0){
        this.elements.push(element);

        //If the collection is already sorted, this check prevents the worst case
    }else if (this.last().getKey()<=key){
        if (this.last().getKey()<key){
            this.elements.push(element);
        }else{
            this.last().addValue(value);
        }
    }else if (this.first().getKey()>=key){
        if (this.first().getKey()<key){
            var tmp=new Array();
            tmp.push(element);
            tmp.concat(this.elements);
            this.elements=tmp;
        }else{
            this.first().addValue(value);
        }
    }else{
        var position=this.positionOf(element);
        if (this.elements[position].getKey()==key){
            this.elements[position].addValue(value);
        }else{
            var tmp1=new Array();
            tmp1=tmp1.concat(this.elements.slice(0,position));
            tmp1.push(element);
            tmp1=tmp1.concat(this.elements.slice(position));
            this.elements=tmp1;
        }
    }
}

net.webrobotics.TreeMap.prototype.positionOf=function(element,elements){
    if (!elements)
        elements=this.elements;

    var half=Math.floor((elements.length-1)/2);
    var c=this.comparator.compare(element,elements[half]);

    if (c==0){
        return half;
    }else{
        if (elements.length==1){
            if (c==-1){
                return 0;
            }else{
                return 1;
            }
        }else if (elements.length==2){
            if (c==-1){
                return 0;
            }else{
                return 1+this.positionOf(element,elements.slice(1));
            }
        }else{
            if (c==-1){
                return this.positionOf(element,elements.slice(0,half));
            }else{
                var tmp2=elements.slice(half+1);
                return elements.length-tmp2.length+this.positionOf(element,tmp2);
            }
        }
    }
}

net.webrobotics.TreeMap.prototype.toArray=function(){
    var out=new Array();
    for(var n=0;n<this.elements.length;n++){
        var el=this.elements[n];
        for (var i=0;i<el.getValues().length;i++){
            out.push(el.getValues()[i]);
        }
    }
    return out;
}


net.webrobotics.TreeMap.prototype.toString=function(){
    var out="";
    for(var n=0;n<this.elements.length;n++){
        var el=this.elements[n];
        var vals="";
        for (var i=0;i<el.getValues().length;i++){
            vals+=el.getValues()[i]+",";
        }
        out+="<"+el.getKey()+","+vals+">; "
    }
    return out;
}

net.webrobotics.TreeMap.prototype.delete=function(key){
    var position=this.positionOf(new net.webrobotics.MapElement(key));

    if (!this.elements[position] || this.elements[position].getKey()!=key)
        return false;
    var tmp1=new Array();
    if (position>0){
        tmp1=tmp1.concat(this.elements.slice(0,position));
    }
    if (position<this.elements.length-1){
        tmp1=tmp1.concat(this.elements.slice(position+1));
    }
    this.elements=tmp1;
    return true;
}

net.webrobotics.TreeMap.prototype.get=function(key){
    var position=this.positionOf(new net.webrobotics.MapElement(key));

    if (!this.elements[position] || this.elements[position].getKey()!=key)
        return null;
    return this.elements[position].getValues();

}