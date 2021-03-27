//Ziel dieser Funktion ist es, jeden Pfadeintrag des Objektes characterImages durch das entsprechende Bildobjekt zu ersetzen und es dadurch vorzuladen.
//Gibt jedes Element des Objekts "characterImages" aus, d.h. den Pfad.
//x ist die Anzahl der Elemente im Objekt
//y ist die Wahl zwischen left und right
//z ist die Anzahl der Elemente in einem spezifischen Array, z.B. 6 Elemente im Array walk-left (da dort 6 Bilder vorhanden).

/**
 * IMAGE CACHING 
 * Catches every entry(path) in an object which contains all image paths, and turns it into an image object.
 * Only for objects which contain two level of arrays.
 * @param  {obj} obj - An object which contains all image paths.
 */
 function preloadCharakterImages(obj) {

    for (let x = 0; x < Object.keys(obj).length; x++) {
        for (let y = 0; y < obj[Object.keys(obj)[x]].length; y++) {
            for (let z = 0; z < obj[Object.keys(obj)[x]][y].length; z++) {
                //Catch every entry (image-path) in e.g. characterImages object
                let path = obj[Object.keys(obj)[x]][y][z];
                //console.log("The entry(path) is: ", path);
                //Creates an image using the current path
                let image = new Image();
                image.src = path;
                //Save the new image object back to image collection object, e.g. characterImages object
                obj[Object.keys(obj)[x]][y][z] = image;
            }
        }
    }
}

/**
 * IMAGE CACHING 
 * Catches every entry(path) in an object which contains all image paths, and turns it into an image object.
 * Only for objects which contain one level of arrays.
 * @param  {obj} obj - An object which contains all image paths.
 */
function preloadOtherImages(obj) {
    for (let x = 0; x < Object.keys(obj).length; x++) {
        for (let y = 0; y < obj[Object.keys(obj)[x]].length; y++) {
            //Catch every entry (img-path) in backgroundImages object
            let path = obj[Object.keys(obj)[x]][y];
            let image = new Image();
            image.src = path;
            //Save entries with img-Objects back to backgroundImages object
            obj[Object.keys(obj)[x]][y] = image;
        }
    }
}