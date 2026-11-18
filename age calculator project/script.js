(function(){
  var $ = function(id){return document.getElementById(id)};
  var dob = $('dob'), asof = $('asof'), err = $('err'), result = $('result');
  var DAY = 86400000;

  function iso(d){
    var m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
    return d.getFullYear()+'-'+m+'-'+day;
  }
  function parse(s){
    var p = s.split('-').map(Number);
    return new Date(p[0], p[1]-1, p[2]);
  }
  function daysInMonth(y, m){ return new Date(y, m+1, 0).getDate(); }
  function utcDays(d){ return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())/DAY); }
  function plural(n, w){ return n === 1 ? w : w+'s'; }
  function fmt(n){ return n.toLocaleString('en-US'); }
  function fmtDate(d){
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  }

  function setToday(){
    var t = new Date();
    asof.value = iso(t);
    dob.max = iso(t);
  }

  function diff(a, b){
    var y = b.getFullYear() - a.getFullYear();
    var m = b.getMonth() - a.getMonth();
    var d = b.getDate() - a.getDate();
    if (d < 0){
      m--;
      var pm = b.getMonth() - 1, py = b.getFullYear();
      if (pm < 0){ pm = 11; py--; }
      d += daysInMonth(py, pm);
    }
    if (m < 0){ m += 12; y--; }
    return {y:y, m:m, d:d};
  }

  // Birthday in a given year; Feb 29 falls on Feb 28 in non-leap years.
  function birthdayIn(year, b){
    var m = b.getMonth(), d = b.getDate();
    if (m === 1 && d === 29 && daysInMonth(year,1) < 29) d = 28;
    return new Date(year, m, d);
  }

  function calc(){
    err.textContent = '';
    if (!dob.value){
      err.textContent = 'Enter your date of birth to calculate your age.';
      result.hidden = true; return;
    }
    if (!asof.value) setToday();
    var b = parse(dob.value), t = parse(asof.value);
    if (isNaN(b) || isNaN(t)){
      err.textContent = 'One of the dates is not valid. Check it and try again.';
      result.hidden = true; return;
    }
    if (b > t){
      err.textContent = 'The birth date is after the “Age on” date. Pick an earlier birth date.';
      result.hidden = true; return;
    }

    var r = diff(b, t);
    $('y').textContent = r.y; $('yl').textContent = plural(r.y,'year');
    $('m').textContent = r.m; $('ml').textContent = plural(r.m,'month');
    $('d').textContent = r.d; $('dl').textContent = plural(r.d,'day');

    var weekday = b.toLocaleDateString('en-US',{weekday:'long'});
    $('sentence').textContent = 'Born on a '+weekday+', '+fmtDate(b)+'. Age counted to '+fmtDate(t)+'.';

    // Birthday window
    var thisYear = birthdayIn(t.getFullYear(), b);
    var next, last;
    if (thisYear >= t){ next = thisYear; last = birthdayIn(t.getFullYear()-1, b); }
    else { last = thisYear; next = birthdayIn(t.getFullYear()+1, b); }
    var daysTo = utcDays(next) - utcDays(t);
    var span = utcDays(next) - utcDays(last);
    var pct = Math.max(0, Math.min(100, ((utcDays(t) - utcDays(last)) / span) * 100));
    var turning = next.getFullYear() - b.getFullYear();

    if (daysTo === 0){
      $('bdayText').textContent = 'Happy birthday! Today you turn '+turning+'.';
      pct = 100;
    } else {
      $('bdayText').textContent = daysTo+' '+plural(daysTo,'day')+' until you turn '+turning+' on '+next.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+'.';
    }
    $('fill').style.width = '0%';
    requestAnimationFrame(function(){ $('fill').style.width = pct.toFixed(1)+'%'; });
    $('bar').setAttribute('aria-valuenow', Math.round(pct));
    $('bar').setAttribute('aria-label','Progress through the current age year');
    $('lastB').textContent = fmtDate(last);
    $('nextB').textContent = fmtDate(next);

    // Totals
    var totalDays = utcDays(t) - utcDays(b);
    var totalMonths = r.y*12 + r.m;
    var stats = [
      [fmt(totalMonths), 'total months'],
      [fmt(Math.floor(totalDays/7)), 'total weeks'],
      [fmt(totalDays), 'total days'],
      [fmt(totalDays*24), 'total hours'],
      [fmt(totalDays*1440), 'total minutes'],
      [fmt(totalDays*86400), 'total seconds']
    ];
    $('grid').innerHTML = stats.map(function(s){
      return '<div class="stat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>';
    }).join('');

    result.hidden = false;
  }

  $('f').addEventListener('submit', function(e){ e.preventDefault(); calc(); });
  dob.addEventListener('change', function(){ if (dob.value) calc(); });
  asof.addEventListener('change', function(){ if (dob.value) calc(); });
  $('reset').addEventListener('click', function(){
    dob.value = ''; setToday(); err.textContent = ''; result.hidden = true; dob.focus();
  });

  setToday();
})();
