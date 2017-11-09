NUM_TILES = 3;
TILE_WIDTH = 400 / NUM_TILES;
BACKGROUND = []
randomBG = []
currentImgClass = "tmotor";
listCLASSES = ["tmotor", 'tlion',  'tkiss'];


function createTiles(currentImgClass) {
    $('#board').empty();
    BACKGROUND = [];
    randomBG = [];
    for (var h = 0; h < NUM_TILES; h++) {
        for (var w=0; w < NUM_TILES; w++) { 
            var top = "-" +  (TILE_WIDTH * h).toString() +"px";
            var left = "-" + (TILE_WIDTH * w).toString() + "px";
            BACKGROUND.push(left + " " + top);
        }
    }
    randomBG = validList(NUM_TILES);
   
    
    //CREATE CELLS and ID and class
    for (var h = 0; h < NUM_TILES; h++) {
        for (var w=0; w < NUM_TILES; w++) {
            var cell = document.createElement("div");
            $('#board').append(cell);
            //ID ASSIGNMENT
            cell.id = "c" + h.toString() + w.toString();
            $(cell).addClass(currentImgClass);
            
            cell.style.top = (TILE_WIDTH * h).toString() +"px";
            cell.style.left = (TILE_WIDTH * w).toString() + "px";
            //the signs needed to be flip positive-> negative

            cell.style.width = TILE_WIDTH.toString() + "px";
            cell.style.height = TILE_WIDTH.toString() + "px";
            
            var index = NUM_TILES * h + w;
            var pos = randomBG[index];
            if (pos == NUM_TILES*NUM_TILES-1) {
                $(cell).addClass('hole');
            }
            $(cell).css('background-position', BACKGROUND[pos]);
        }
    }
    
    //THE COMPLETE IMAGE
    var f1 = $('.'+currentImgClass).first().css('background-image');
    var f2 = $('.'+currentImgClass+':nth-child(2)').first().css('background-image');
    var f3 = $('.'+currentImgClass).last().css('background-image');
    // make sure that the two of three would be selected, eliminate choosing the hole as the background
    var f = (f1 == f2 ? f1 : f3);
    $('#complete').css('background-image', f);

}
function validList(n) {
  list = []
  for (i=0; i< (n*n); i++) { list.push(i); }
    
  function shuffle(list) {
      for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
      }
  }
    
//If the grid width is odd, then the number of inversions in a solvable situation is even.
//If the grid width is even, and the blank is on an even row counting from the bottom (second-last, fourth-last etc), then the number of inversions in a solvable situation is odd.
//If the grid width is even, and the blank is on an odd row counting from the bottom (last, third-last, fifth-last etc) then the number of inversions in a solvable situation is even.
  function solvable(list) {
        var inversionSum = 0
        for (var i = 0; i < list.length; i++) {
        var inversion = 0;
        if (list[i] == (n*n-1)) {
            if (NUM_TILES%2 == 0) {
                inversion = Math.floor(i/n) + 1;
            } else { inversion == 0 };
        } else {
          for (var j = i; j < list.length; j++) {
            if (list[i]>list[j]) { 
              inversion = inversion + 1; 
            }
          } 
        }
            
        inversionSum = inversionSum + inversion;
        }
     
        return inversionSum%2 == 0;
        }
    
  shuffle(list);
  while (!solvable(list)) { shuffle(list); }

  return list;
}

function checkWin() {
    for (var h = 0; h < NUM_TILES; h++) {
        for (var w=0; w < NUM_TILES; w++) {
            //CLUMSY FIX - BUT WORK - fix the decimal-precision and negative sign bug
            var bg = $("#c" + h + w).css('background-position').replace(/-/g,'').replace(/\..*?px/g,'px');
            var expected = BACKGROUND[h*NUM_TILES + w].replace(/-/g,'').replace(/\..*?px/g,'px');;
     
            if (bg != expected) {  return false; }
        }
    }
    return true;
}

function updateStatus() {
 //CHECK FOR WINNING CONDITION
   setTimeout(function() {
        if (checkWin()) {  
            $("#status").text("Well done!");
			$("#status").addClass('completed-puzzle');
			document.getElementById('won').currentTime = 0 ;
			document.getElementById('won').play();
			
         
        } else {
			$("#status").removeClass('completed-puzzle');
            $("#status").text("Keep sliding. . .");
            
        }
   },100);
}

$(document).keyup(function(event) {
    updateStatus();
	
	var sound = document.getElementById('sliding');
	
   if (event.key == "ArrowLeft") {
	   
	   sound.currentTime = 0;
	   sound.play();
	   
       var hole = $("#board").find('.hole');
       var holdID = hole.attr('id');
       var holePOSITION = hole.css('background-position');
       
       var toID = holdID[0] + holdID[1] + (Math.min((parseInt(holdID[2])+1), NUM_TILES-1));
       var to = $("#" + toID)
       var toPOSITION = to.css('background-position');

       
       hole.css('background-position', toPOSITION);
       hole.removeClass('hole');
       
       to.css('background-position', holePOSITION);
       to.addClass('hole');
   }
    
   if (event.key == "ArrowRight") {
	   sound.currentTime = 0;
	   sound.play();
       var hole = $("#board").find('.hole');
       var holdID = hole.attr('id');
       var holePOSITION = hole.css('background-position');
       
       var toID = holdID[0] + holdID[1] + (Math.max((parseInt(holdID[2])-1), 0));
       var to = $("#" + toID)
       var toPOSITION = to.css('background-position');
       
       hole.css('background-position', toPOSITION);
       hole.removeClass('hole');
       to.css('background-position', holePOSITION);
       to.addClass('hole');
   }
   if (event.key == "ArrowUp") {
	   sound.currentTime = 0;
	   sound.play();
       var hole = $("#board").find('.hole');
       var holdID = hole.attr('id');
       var holePOSITION = hole.css('background-position');
       
       var toID = holdID[0] + (Math.min((parseInt(holdID[1])+1), NUM_TILES-1)) + holdID[2]  ;
       var to = $("#" + toID)
       var toPOSITION = to.css('background-position');
       
       hole.css('background-position', toPOSITION);
       hole.removeClass('hole');
       to.css('background-position', holePOSITION);
       to.addClass('hole');
   }
   
   if (event.key == "ArrowDown") {
	   sound.currentTime = 0;
	   sound.play();
       var hole = $("#board").find('.hole');
       var holdID = hole.attr('id');
       var holePOSITION = hole.css('background-position');
       
       var toID = holdID[0] + (Math.max((parseInt(holdID[1])-1), 0)) + holdID[2]  ;
       var to = $("#" + toID)
       var toPOSITION = to.css('background-position');
       
       hole.css('background-position', toPOSITION);
       hole.removeClass('hole');
       to.css('background-position', holePOSITION);
       to.addClass('hole');
   }
    
   

   
   if (event.key == 'c' || event.key == "C") {
       $("#C").click();
   }
    
   if (event.key == 'r' || event.key == "R") {
       $("#R").click();
   }
    
});




$(document).ready(function() {
    createTiles(currentImgClass);
    updateStatus();

    //NEW DIFFICULTY
    $("#go").click(function() {
        NUM_TILES = parseInt($("#gotext").val());
        if (2<= NUM_TILES) {
			//BIG BUG
           $("#fakeclick").click(); //click away from chosen file so user has to re-click "use own image" radio for this to work - STRANGE but cannot work around otherwise
		   TILE_WIDTH = 400 / NUM_TILES;
            BACKGROUND = [];
            randomBG = [];
            listCLASSES = ["t2", 't3',  'ta2'];
            createTiles(currentImgClass);
            updateStatus();
        } else {
            alert("Not a valid level of difficulty");
        }

    });

    //NEW CONFIGURATION
    $("#C").click(function() {
        createTiles(currentImgClass);
        updateStatus();
        var checked = $('input[name=img]:checked').val();
        if (checked=="own") {
            var divchecked = "#preview" + checked;
            var img = $(divchecked).children('img')[0];
            var source = img.src;
            var url = 'url("' + source + '")';
            $("#board").children().css('background-image',url);
            $('#complete').css('background-image', url);
        }
    });
    
    //RESET GAME
    $("#R").click(function() {
        for (var h = 0; h < NUM_TILES; h++) {
            for (var w=0; w < NUM_TILES; w++) {
                var cell = $("#c"+h+w);
                cell.empty();
                cell.removeClass();
                cell.addClass(currentImgClass);
                var index = NUM_TILES * h + w;
                var pos = randomBG[index];
                if (pos == NUM_TILES*NUM_TILES-1) {
                    $(cell).addClass('hole');
                }
                $(cell).css('background-position', BACKGROUND[pos]);
            }
        }
        updateStatus();
    });
    
    
    //LET USER UPLOAD THEIR OWN IMG
    $( "#choosefile" ).change(function() {
        
        $("#own").attr('disabled', false);
         //grab the first image in the fileList
         f = this.files[0];

        var reader = new FileReader();
        reader.onload = function(event){
            var the_url = event.target.result;
              //handlebars.js is a better solution than just inserting a string
            var img = $('<img />', { 
                  id: 'uploadIMG',
                  src: the_url,
                  class: 'center'
                });
            $('#previewown').empty(); //CLEAR previous img if existed
            $('#previewown').prepend(img);

        }
      //when the file is read it triggers the onload event above.
        
    $("#fakeclick").click(); //click away from chosen file so user has to re-click "use own image" radio for this to work - STRANGE but cannot work around otherwise
      reader.readAsDataURL(f);
        
    });
    
    $('input[type=radio][name=img]').change(function() {
        $('input[type=radio][name=img]').blur();
        $('#board').focus();
        var checked = $('input[name=img]:checked').val();
        currentImgClass = "t"+checked;
  
        createTiles(currentImgClass);
        var divchecked = "#preview" + checked;

        var img = $(divchecked).children('img')[0];
        

        var source = img.src;

        var url = 'url("' + source + '")';
        $("#board").children().css('background-image',url);

        $('#complete').css('background-image', url);
        updateStatus();
    });

});




