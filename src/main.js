let regularStreamers = [
  "ESL_SC2", 
  "OgamingSC2", 
  "cretetion", 
  "freecodecamp", 
  "storbeck", 
  "habathcx", 
  "RobotCaleb", 
  "noobs2ninjas"];

const convertChannelData = ( rawData ) => {
  let data = {};
  if ( !rawData || rawData.error  ) {
    data.error = true;
    return data;
  }
  
  data.status = rawData.stream ? rawData.stream.channel.status : "offline";
  data.name = rawData.display_name;
  data.handle = rawData.name;
  data.logo = rawData.logo;
  return data;
}

const addChannel = ( channel ) => {
  let onlineClass = (channel.status !== "offline" ) ? " channel--online" : "";
  let linkHref = channel.handle ? "https://www.twitch.tv/" + channel.handle : "javascript:void(0);";
  let channelHtml = "<a href=\"" + linkHref + "\" class=\"channel__link\" target=\"_blank\">" +
    "<div class=\"channel" + onlineClass + "\">" +
    "<span class=\"channel__icon\">" + "<img src=\"" + channel.logo + "\">" + "</span>" +
    "<span class=\"channel__name\">" + channel.name + "</span>" + 
    "<span class=\"channel__details\">" + channel.status + "</span>" +
    "</div>" +
    "</a>";
  
  $( ".display" ).append( channelHtml );
};

const channelSort = (a,b) => {
  if ( !a ) {
    return 1;
  } else if ( !b ) {
    return -1;
  }
  
  let aName = a.display_name;
  let bName = b.display_name;
  
  if ( aName.toLowerCase() < bName.toLowerCase() ) {
    return -1;
  } else if ( aName.toLowerCase() > bName.toLowerCase() ) {
    return 1;
  }
  return 0;
}

const addChannels = ( data ) => {
  data.sort( channelSort );
  for ( var channelData of data ) {
    let convertedData = convertChannelData( channelData );
    if ( !convertedData.error ) {
      addChannel( convertedData );
    }
  }
}

const clearChannels = () => {
  $( ".channel" ).remove();
};

const compileUserData = ( users, streams ) => {
  let compiledUsers = users.map( (user, index) => {
    user.stream = streams[ index ].stream;
    return user;
  } );
  console.log( "compiled: ", compiledUsers );
  addChannels( compiledUsers );
}

const getStreamData = ( users ) => {
  let promises = users.map( user => $.getJSON("https://wind-bow.glitch.me/twitch-api/streams/" + user.name + "?callback=?") );
  Promise.all( promises ).then( streams => { compileUserData( users, streams ) } );
}

const getData = () => {
  clearChannels();
  let promises = regularStreamers.map( user => $.getJSON("https://wind-bow.glitch.me/twitch-api/users/" + user + "?callback=?") );
  Promise.all( promises ).then( getStreamData );
};

$( "document" ).ready( getData );
