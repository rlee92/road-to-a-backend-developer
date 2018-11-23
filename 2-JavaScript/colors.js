var Links = {
   setColor:function(color) {
    var links = document.querySelectorAll('a')
    var i = 0
    while(i<links.length){
      links[i].style.color=color
      i++
    }
  }
}

var Body = {
  setBodyColor:function(color){
      document.querySelector('body').style.color = color
  },
  setBackgroundColor:function(color){
    document.querySelector('body').style.backgroundColor = color
  }
}

function darkModeHandler(self){
    if(self.value ==='dark-mode') {
      Body.setBackgroundColor('black')
      Body.setBodyColor('white')
      Links.setColor('powderblue')
      self.value = 'light-mode'
    } else {
      Body.setBackgroundColor('white')
      Body.setBodyColor('black')
      Links.setColor('coral')
      self.value = 'dark-mode'
    }
}
