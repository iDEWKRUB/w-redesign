(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const TD = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const TM = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  // Next six working days (Mon–Fri)
  const days = []; const x = new Date();
  while (days.length < 6) { x.setDate(x.getDate() + 1); if (x.getDay() > 0 && x.getDay() < 6) days.push(new Date(x)); }
  $('#days').innerHTML = days.map((d, i) => `<label class="opt"><input type="radio" name="day" value="${TD[d.getDay()]} ${d.getDate()} ${TM[d.getMonth()]}"${i === 0 ? '' : ''}><span>${TD[d.getDay()]}<small>${d.getDate()} ${TM[d.getMonth()]}</small></span></label>`).join('');

  // Coming from a design's "นัดคุยเรื่องแบบนี้" → contact.html#d-m062
  let design = null;
  const picked = $('#picked');
  const k = location.hash.startsWith('#d-') ? location.hash.slice(3) : null;
  if (k && (window.WH_DESIGNS || []).some(x => x.k === k)) {
    const d = (window.WH_DESIGNS || []).find(x => x.k === k);
    const name = d ? (d.name ? d.name + ' · ' + d.code : d.code) : k.toUpperCase();
    design = name;
    $('#pkImg').src = `img/d/${k}.jpg`;
    $('#pkName').textContent = name;
    picked.classList.add('on');
    const std = $('input[name="need"][value="ปรับจากแบบบ้านมาตรฐาน"]'); if (std) std.checked = true;
  }
  $('#pkClear').addEventListener('click', () => { design = null; picked.classList.remove('on'); history.replaceState(null, '', location.pathname); });

  const form = $('#bookform');
  const field = id => $('#' + id).closest('.fi');
  const check = () => {
    let ok = true;
    const name = $('#c-name').value.trim(), tel = $('#c-tel').value.replace(/\D/g, ''), mail = $('#c-mail').value.trim();
    field('c-name').classList.toggle('err', !name); ok = ok && !!name;
    const telOk = tel.length >= 9 && tel.length <= 10; field('c-tel').classList.toggle('err', !telOk); ok = ok && telOk;
    const mailOk = !mail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail); field('c-mail').classList.toggle('err', !mailOk); ok = ok && mailOk;
    const day = $('input[name="day"]:checked'); $('#days').closest('.fi').classList.toggle('err', !day); ok = ok && !!day;
    return ok;
  };
  ['c-name', 'c-tel', 'c-mail'].forEach(id => $('#' + id).addEventListener('input', () => { if (field(id).classList.contains('err')) check(); }));
  $('#days').addEventListener('change', () => $('#days').closest('.fi').classList.remove('err'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!check()) { const first = $('.fi.err input, .fi.err'); first && (first.focus ? first.focus() : first.scrollIntoView({ block: 'center' })); return; }
    const v = n => ($(`input[name="${n}"]:checked`) || {}).value || '-';
    const rows = [['ชื่อ', $('#c-name').value.trim()], ['เบอร์โทร', $('#c-tel').value.trim()], ['วันเวลา', `${v('day')} · ${v('time')} น.`], ['รูปแบบ', v('mode')], ['สิ่งที่สนใจ', v('need')], ['ทำเล', $('#c-loc').value]];
    if (design) rows.splice(4, 0, ['แบบที่สนใจ', design]);
    $('#doneList').innerHTML = rows.map(([a, b]) => `<div><dt>${a}</dt><dd></dd></div>`).join('');
    $$('#doneList dd').forEach((dd, i) => { dd.textContent = rows[i][1]; });
    form.hidden = true; $('#done').hidden = false;
    $('#formcard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#editAgain').addEventListener('click', () => { $('#done').hidden = true; form.hidden = false; $('#c-name').focus(); });
})();
