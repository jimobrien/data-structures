var HashTable = function() {
  this._limit = 8;
  this._count = 0;
  this._storage = makeLimitedArray(this._limit);
};

HashTable.prototype.insert = function(k, v) {
  var index = getIndexBelowMaxForKey(k, this._limit);
  var bucket = this._storage.get(index);
  
  if (!bucket) {
    bucket = [];
    this._storage.set(index, bucket);
  }

  bucket.push([k,v]);
  this._count += 1;

  if (this._count > 0.75 * this._limit) {
    this._resize(this._limit*2);
  }
};

HashTable.prototype.retrieve = function(k){
  var idx = getIndexBelowMaxForKey(k, this._limit);
  var bucket = this._storage.get(idx);

  if (!bucket) {
    return null;
  }

  for(var i = 0; i < bucket.length; i++){
    if (bucket[i][0] === k) {
      return bucket[i][1];
    }
  }

  return null;
};

HashTable.prototype.remove = function(k){
  var idx = getIndexBelowMaxForKey(k, this._limit);
  var bucket = this._storage.get(idx);

  if (!bucket) {
    return null;
  }

  for(var i = 0; i < bucket.length; i++){
    var tuple = bucket[i];
    
    if (tuple[0] === k) {
      bucket.splice(i);
      this._count -= 1;
      if (this._count < 0.25 * this._limit) {
        this._resize(this._limit/2);
      }
      return tuple[1];
    }
  }

  return null;
};

/*
 * Complexity: What is the time complexity of the above functions?
 */

HashTable.prototype._resize = function(newSize) {
  var oldStorage = this._storage;
  var context = this;

  this._storage = makeLimitedArray(newSize);
  this._limit = newSize;
  this._count = 0;

  oldStorage.each(function(bucket) {
    if (bucket === undefined) { 
      return; 
    }

    for (var i = 0; i < bucket.length; i++) {
      context.insert(bucket[i][0], bucket[i][1]);
    }
  });
};