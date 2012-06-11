
TreeMapTest = TestCase("TreeMapTest");
var tree;

//initialization, this function will be invoked before each test.
TreeMapTest.prototype.setUp=function(){
    // create and populate the treemap
    tree = new net.webrobotics.TreeMap(comparator);
    tree.put(1,"ciao");
    tree.put(8,"miao");
    tree.put(10,"bau");
    tree.put(3,"gdb");
    tree.put(7,"titto");

}

TreeMapTest.prototype.testPositionOf = function() {
    tree.delete(7);

    assertEquals(2, tree.positionOf(7));
    assertEquals(8, tree.elements[tree.positionOf(7)].getKey());
}

TreeMapTest.prototype.testPut = function() {
    tree = new net.webrobotics.TreeMap(comparator);

    tree.put(1,"ciao");
    assertEquals(["ciao"], tree.toArray());

    tree.put(8,"miao");
    assertEquals(["ciao","miao"], tree.toArray());

    tree.put(10,"bau");
    assertEquals(["ciao","miao","bau"], tree.toArray());

    tree.put(3,"gdb");
    assertEquals(["ciao","gdb","miao","bau"], tree.toArray());

    tree.put(7,"titto");
    assertEquals(["ciao","gdb","titto","miao","bau"], tree.toArray());

}

TreeMapTest.prototype.testNearest = function() {
    assertEquals(["ciao"], tree.nearest(1)); //test the first position
    assertEquals(["bau"], tree.nearest(11)); //test the last position
    assertEquals(["gdb"], tree.nearest(4)); //test after=null
    assertEquals(["gdb"], tree.nearest(4,false)); //test after=false
    assertEquals(["titto"], tree.nearest(4,true)); //test after=true
}

TreeMapTest.prototype.testGet = function() {
    tree.put(7,"pizzo");
    assertEquals(["ciao"], tree.get(1)); //test the first element
    assertEquals(["titto","pizzo"], tree.get(7)); //test with a collision
    assertEquals(["bau"], tree.get(10)); //test the last element

}

TreeMapTest.prototype.testAt = function() {
    assertEquals(["ciao"], tree.at(0));
    assertEquals(["gdb"], tree.at(1));
    assertEquals(["titto"], tree.at(2));
    assertEquals(["miao"], tree.at(3));
    assertEquals(["bau"], tree.at(4));

}

TreeMapTest.prototype.testDelete = function() {
    tree.delete(1);
    assertEquals(["gdb","titto","miao","bau"], tree.toArray()); //test the first position

    tree.delete(10);
    assertEquals(["gdb","titto","miao"], tree.toArray()); //test the last position

    tree.delete(7);
    assertEquals(["gdb","miao"], tree.toArray());
}

TreeMapTest.prototype.testFirstLast = function() {
    assertEquals(tree.at(0), tree.first());
    assertEquals(tree.at(tree.size()-1), tree.last());
}

//this function will be invoked after each test.
TreeMapTest.prototype.tearDown=function(){

}

