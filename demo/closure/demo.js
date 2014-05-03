(function outer () {
    var a,b,c,d
    // Closure : 
    // Where a function remembers what happens around it.
    function inner () {
        console.log(a,b,c)
    }
    inner();
})();