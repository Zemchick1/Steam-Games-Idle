
// Copyright notice:

/*--------------------------------------------------------------------------------------------- 
* Original work: Copyright (c) 2020-2021-2022-2023 Refloow All rights reserved.

* Code origin: https://github.com/Refloow/Steam-Games-Idle
* Developer name: Veljko Vuckovic
* Licensed under the MIT License. See LICENSE in the project root for license information.
* Published License: https://github.com/Refloow/Steam-Games-Idle/master/LICENSE

* Contact information:
  Discord Support Server: https://discord.gg/D8WCtDD
  Main developer steam: https://steamcommunity.com/id/MajokingGames/ 
  Mail: refloowlibrarycontact@gmail.com
  
  * Donations:
  Crypto: https://refloow.com/cdonate
  Steam: https://steamcommunity.com/tradeoffer/new/?partner=994828078&token=XEUdbqp6
  
 --------------------------------------------------------------------------------------------*/

 /* 

// legal advice: PERMISSIONS AND RIGHTS

* License does not prohibit modification, distribution, private/commercial use or sale of copies as long as the original LICENSE file
 and authors copyright notice are left as they are in the project files.
* Copyright notice could be included ones or multiple times within the file.
* Copyright notice should not be removed even within the larger works (Larger modifications applied).
* Original file tags cannot be removed without creators exclusive permission.
* Adding own tags in files is possible in case of modification - even in that case original tags must be kept.
* Year on the copyright notice breakdown:
* Generally, the “year of first publication of the work” refers to the year in which the work was first distributed to the public (first year mentioned)
* Any year after represents the year of added modifications.
* Copyright cannot expire so therefore you cannot remove copyright notice if its not updated to the latest year.
* Editing existing copyright notice(s) is also prohibited.

===================================================================================
Removing copyright notice & distributing, using or selling the software without
the original license and copyright notice is licence agreement breach and its considered criminal offense and piracy.
===================================================================================

*/

// Checking if required modules are properly installed

try {
	// Checking if module steam-user is installed
	SteamUser = require('steam-user');
	// Checking if module steam-totp is installed
	SteamTotp = require('steam-totp');
	// Checking if module steamcommunity is installed
	SteamCommunity = require('steamcommunity');
	// Checking if module console-master is installed
	Console = require('console-master');
} catch (ex) {
	// If modules are not installed showing an clear error message to user.
	console.log('| [Modules] |: Missing dependencies. Install a version with dependecies or use npm install.');
	console.log(ex);
	process.exit(1);
}

// Importing required files
const config = require('./Settings/config.js');
const method = require('./methods');

// Name of the client
const refloowidle = new SteamUser();

// Handles Steam Guard email/mobile codes when no shared_secret is configured.
// On a headless host (e.g. Railway) there's no terminal to type a code into, so
// this only works when run locally with an interactive stdin. Use it once to
// obtain a refresh token (see the 'refreshToken' event below), then set
// STEAM_REFRESH_TOKEN so future logins skip Steam Guard entirely.
const readline = require('readline');
refloowidle.on('steamGuard', (domain, callback, lastCodeWrong) => {
	if (!process.stdin.isTTY) {
		Console.error('| [STEAM GUARD] |: A Steam Guard code is required but this is a non-interactive environment. Run the bot locally once with STEAM_USERNAME/STEAM_PASSWORD set to obtain a refresh token, then set STEAM_REFRESH_TOKEN.');
		return;
	}
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	const prompt = domain
		? `Enter the Steam Guard code emailed to you (ending in ${domain}): `
		: 'Enter your Steam Guard mobile authenticator code: ';
	rl.question(lastCodeWrong ? `That code was wrong. ${prompt}` : prompt, code => {
		rl.close();
		callback(code.trim());
	});
});

// Emitted after any successful account name + password login. Save this value as
// STEAM_REFRESH_TOKEN in Railway to log in without Steam Guard for ~200 days.
refloowidle.on('refreshToken', token => {
	Console.true('| [STEAM] | REFRESH TOKEN |: Save this as STEAM_REFRESH_TOKEN to skip Steam Guard next time:');
	console.log(token);
});

// Checking for correct version (updates) for bot on github
if(method.UpdateNotifDisable()) {
    method.check();
}

// APP START

function pickLogOnOptions() {
	// Individually using a refresh token skips Steam Guard entirely (recommended for Railway).
	if (config.refreshToken) {
		return { refreshToken: config.refreshToken };
	}
	// Auto-generating 2fa codes requires a shared_secret.
	if (method.AutoGenerateLoginCodes() && config.shared_secret) {
		return {
			accountName: config.loginAccName,
			password: config.password,
			twoFactorCode: SteamTotp.generateAuthCode(config.shared_secret)
		};
	}
	// Falls back to the 'steamGuard' event above for a manually entered code.
	return {
		accountName: config.loginAccName,
		password: config.password,
	};
}

refloowidle.logOn(pickLogOnOptions());

	function a(){
	    var items = config.GameToIdleFor;
		var item = items[Math.floor(Math.random()*items.length)];
    refloowidle.gamesPlayed(item);
    Console.info(`| [IDLE] | GAMES |: Bot started idling for ${item}`);
    	var uptime = process.uptime();
	const date = new Date(uptime*1000);
	const days = date.getUTCDate() - 1,
		hours = date.getUTCHours(),
		minutes = date.getUTCMinutes(),
		seconds = date.getUTCSeconds();

		let segments = [];

		if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
		if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
		if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
		if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
		const dateString = segments.join(', ');

		Console.info("| [UPTIME] | Idle for: " + dateString);
    }    

// Set Idle Game
refloowidle.on('loggedOn', () => {
	refloowidle.setPersona(1);
	Console.true(`| [Reflooow] | LOGIN |: Signed into steam. Script is setting game to idle for....`);
	// Setting game to idle for
    a();
 })
	
setInterval(a, config.Interval);

// Copyright notice:

/* Original work: Copyright (c) 2020-2021 Refloow All rights reserved.
  Code origin (Free GitHub publish): https://github.com/Refloow/Steam-Games-Idle*/
