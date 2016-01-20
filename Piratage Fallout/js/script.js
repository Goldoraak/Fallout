function generateForm(words, start)
{
	var nbWords = words.length;
	var html = '';

	html += '<div class="row">';
	html += '	<fieldset>';
	html += '		<legend>Saisie des mots</legend>';
  						
	html += '	<div class="col-sm-6">';

	for(var i = 0; i < nbWords; i++)
	{
		if(i == Math.round((nbWords / 2)) )
		{
			html += '	</div>';
			html += '	<div class="col-sm-6">';
		}

		html += '		<div class="form-group">';
		html += '			<label for="word-'+ (i+1) +'" class="sr-only">Mot '+ (i+1) +'</label>';
		html += '			<input type="text" name="word-'+ i+1 +'" id="word-'+ i+1 +'" class="form-control" value="'+ words[i] +'" />';
		html += '		</div>';
	}

	html += '	</div>';
	html += '	</fieldset>';
	html += '</div>';

	if(start != undefined)
	{
		html += '<div class="row">';
		html += '	<div class="form-group">';
		html += '		<div class="col-sm-12">';
		html += '			<button type="submit" class="btn btn-primary">Valider</button>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
	}

	$("#form-words").empty();
	$("#form-words").prepend(html);

	if(start == undefined)
	{
		$("#nb-match").val("");
		$("#form-words").submit();
	}
}

function getWordsList()
{
	var params = $("#form-words").serializeArray();
	var nbWords = params.length;
	var words = new Array();

	// On récupère la la liste des mots dans un tableau nommé "words"
	for(var i = 0; i < nbWords; i++)
	{
		words.push(params[i].value);
	}

	return words;
}

// Cette focntion renvoie la lettre qui revient le plus souvent dans la liste de lettres passées en paramètre
function getMaxOccurencesLetter(t)
{
	var lettreCourante = new Array();
	var lettreMaxOccurence = ["", 0];
	var size = t.length;
	var count = 0;

	for(var i = 0; i < size; i++)
	{
		for(var j = 0; j < size; j++)
		{
			if(t[i] == t[j]) count++;
		}

		lettreCourante.push([t[i], count]);
		count = 0;

		if(lettreCourante[i][1] > lettreMaxOccurence[1]) lettreMaxOccurence = lettreCourante[i];
	}

	return lettreMaxOccurence[0];
}

// Cette fonction considère l'ensemble des mots de la liste de mots passée en paramètre
// pour créer un nouveau mot dont chaque lettre est celle revenant le plus souvent à sa position
function getMaxOccurenceLettersWord(words)
{
	var nbWords = words.length;
	var sizeWord = words[0].length;
	var maxOccurenceLetters = new Array();
	
	for(var i = 0; i < sizeWord; i++)
	{
		var temp = new Array();

		for(var j = 0; j < nbWords; j++)
		{
			temp.push(words[j].charAt(i));
		}

		maxOccurenceLetters.push(getMaxOccurencesLetter(temp));
	}

	return maxOccurenceLetters;
}

function maxMatch(words, word)
{
	var nbWords = words.length;
	var sizeWord = word.length;
	var maxMatch = 0;
	var returnIndexWord = 0;

	for(var i = 0; i < nbWords; i++)
	{
		var currentWord = words[i];
		var nbMatch = 0;

		for(var j = 0; j < sizeWord; j++)
		{
			if(currentWord[j] == word[j]) nbMatch++;
		}

		if(nbMatch > maxMatch)
		{
			maxMatch = nbMatch;
			returnIndexWord = i;
		} 
	}

	return words[returnIndexWord];
}

function getMatchWords(words, word, nbMatch)
{
	var matchWords = new Array();
	var nbWords = words.length;
	var sizeWord = word.length;

	for(var i = 0; i < nbWords; i++)
	{
		var currentWord = words[i];
		var count = 0;

		for(var j = 0; j < sizeWord; j++)
		{
			if(currentWord[j] == word[j]) count++;
		}

		if(count == nbMatch) matchWords.push(currentWord);
	}

	return matchWords;
}

$(document).ready(function(){
	var iteration = 0;

	$("#form-nb-words").submit(function(e){
		e.preventDefault();

		var words = new Array();
		var nbWords = parseInt($("#nb-words").val());

		for(var i = 0; i < nbWords; i++)
		{
			words.push("");
		}

		generateForm(words, true);

		$(this).hide();
	});

	$("#form-words").submit(function(e){
		e.preventDefault();

		iteration++;

		// Onrécupère la liste de mots remplie par l'utilisateur
		var words = getWordsList();

		// On génère le mot qui correspond au maximum d'occurence de lettres à chaque position
		var maxOccurenceLetters = getMaxOccurenceLettersWord(words);

		// On récupère le mot ayant la plus grande correspondance avec le mot généré
		var maxMatchWord = maxMatch(words, maxOccurenceLetters);

		$("#result").html(maxMatchWord);
		$(".iteration-number").html(iteration);
		$("#form-result").show();
		window.location.hash = "form-result";
	});

	$("#form-result").submit(function(e){
		e.preventDefault();

		var words = getWordsList();
		var word = $("#result").html();
		var nbMatch = $(this).serializeArray()[0].value;
		
		var matchWords = getMatchWords(words, word, nbMatch);

		if(matchWords.length == 1)
		{
			$("#result-word").html(matchWords[0]);
			$("#result-box").show();
			window.location.hash = "result-box";
		}
		else
		{
			generateForm(matchWords);
		}
	});

});