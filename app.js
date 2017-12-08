const mergeImages = require('merge-images');
const Canvas = require('canvas');
const fs = require("fs");
const path = require('path');

const gym_path = 'C:\\Users\\ikae\\Desktop\\Test\\gym\\teams';
const pokemon_path = 'C:\\Users\\ikae\\Desktop\\Test\\gym\\icons';
const output_path = 'C:\\Users\\ikae\\Desktop\\Test\\gym\\outputs';

const pokemonWithImages = [
	2, 3, 5, 6, 8, 9, 11, 28, 31, 34, 38, 59, 62, 65, 68, 71, 73, 76, 82, 89, 91, 94, 103, 105, 110, 112, 123, 125, 126, 129, 131, 134,
	135, 136, 137, 139, 143, 144, 145, 146, 150, 153, 156, 159, 243, 244, 245, 248, 249, 250, 302
]

 function decodeBase64Image(dataString) 
{
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) 
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

const gym_arrays = [];
const pokemon_arrays = [];

fs.readdirSync(gym_path).forEach(file => {
	const file_path = path.join(gym_path, file);
	const file_name = path.basename(file_path, '.png');
  gym_arrays.push(file_path);
});

fs.readdirSync(pokemon_path).forEach(file => {
	const file_path = path.join(pokemon_path, file);
	const file_name = path.basename(file_path, '.png');
	if (pokemonWithImages.indexOf(parseInt(file_name))>=0){
		pokemon_arrays.push(file_path);
	}
});

const result = [];
gym_arrays.forEach(gym => {
	pokemon_arrays.forEach(pokemon => {
		const raid_name = `${path.basename(gym,'.png')}_${path.basename(pokemon,'.png')}.png`;
		const raid = path.join(output_path, raid_name);

		mergeImages([{ src: gym, x: 0, y: 0 }, { src: pokemon, x: 16, y: 16 }], { Canvas: Canvas, format: 'image/png', width: 96, height: 96 })		
		.then(b64 => new Promise(function (fulfill, reject){
			fs.writeFile(raid, decodeBase64Image(b64).data, function (err, res){
				if (err) reject(err);
				else fulfill(res);
			});
		}))
		.catch(e => {
			if (!e) console.log(e);
		})	
	})
})
