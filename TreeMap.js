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

net.webrobotics.MapElement.prototype.getLastValue=function(){
    return this.values[this.values.length-1];
}

//##########################################################
//#### Comparator for bgplay.js
//#### @Massimo Candela
//#### webrobotics.net
//##########################################################

var comparator=function(key1,key2){
    if (key1<key2)
        return -1
    else if (key1>key2)
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

net.webrobotics.TreeMap.prototype.size=function(duplicates){
    if (duplicates){
        var out=0;
        for (var n=0;n<this.elements.length;n++){
            out+=this.elements[n].getValues().length
        }
        return out;
    }else
        return this.elements.length;
}

net.webrobotics.TreeMap.prototype.last=function(){
    return this.elements[this.size()-1].getValues();
}

net.webrobotics.TreeMap.prototype.first=function(){
    return this.elements[0].getValues();
}

net.webrobotics.TreeMap.prototype.at=function(at){
    if (this.elements[at])
        return this.elements[at].getValues();
    return null;
}

net.webrobotics.TreeMap.prototype.put=function(key,value){
    var element=new net.webrobotics.MapElement(key);
    element.addValue(value);

    if (this.size()==0){
        this.elements.push(element);
        return;
    }

    var position,cur_element;

    var comparation=this.comparator(this.elements[this.elements.length-1].getKey(),key);
    if (comparation<=0){
        if (comparation==0){
            position=this.elements.length-1;
        }else{
            position=this.elements.length;
        }
    }else if (this.comparator(this.elements[0].getKey(),key)>=0){
        position=0;
    }else{
        position=this.positionOf(key);
    }

    cur_element=this.elements[position];
    if (cur_element!=null && cur_element.getKey()==key){
        cur_element.addValue(value);
    }else{
        var tmp=new Array();
        tmp=tmp.concat(this.elements.slice(0,position));
        tmp.push(element);
        tmp=tmp.concat(this.elements.slice(position));
        this.elements=tmp;
    }
}

net.webrobotics.TreeMap.prototype.positionOf=function(key){
    this.positionOfTR=function(key,elements,start,stop){
        var size=(stop-start)+1;

        var half=Math.floor((size)/2)+start;
        var comparation=this.comparator(elements[half].getKey(),key);

        if (comparation==0){
            return half;
        }else{
            if (size==1){
                if (comparation==-1){
                    return start+1;
                }else{
                    return start;
                }
            }else{
                if (comparation==-1){
                    return this.positionOfTR(key,elements,half,stop);
                }else{
                    return this.positionOfTR(key,elements,start,half-1);
                }
            }
        }
    }

    return this.positionOfTR(key,this.elements,0,this.elements.length-1);
}

net.webrobotics.TreeMap.prototype.toArray=function(){
    var out=new Array();
    for(var n=0;n<this.elements.length;n++){
        var el=this.elements[n];
        out=out.concat(el.getValues());
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
    var position=this.positionOf(key);

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
    var position=this.positionOf(key);

    if (!this.elements[position] || this.elements[position].getKey()!=key)
        return null;
    return this.at(position);
}

net.webrobotics.TreeMap.prototype.nearest=function(key,after){
    var position=this.positionOf(key);
    var element=this.elements[position];
    if((element != null && element.getKey() == key) || after) {
        return element.getValues();
    }
    return this.at(position-1);
}