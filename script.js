
var cont_list; // コンテンツデータのリスト
var card_list; // コンテンツカードのリスト
var selected_list; // 選択状態のコンテンツidのリスト
var match_list; // 属性値が一致したコンテンツidのリスト
var tgt_att; // 一致をチェックする属性のキー
var all_clear; // 全正解状態

function get_randint(max){
  // 正数乱数を返す
  
  return Math.floor(Math.random() * Math.floor(max));
}

function make_dummy_data(){
  // 適当なコンテンツデータを作る
  // 
  // コンテンツデータフォーマット (JSON)
  //   {
  //     'img_url': コンテンツのサムネイル画像URL (カードの表絵),
  //     'title': コンテンツのタイトル (カードの表名),
  //     'atts': { (コンテンツの属性)
  //       属性キー1: 値1,
  //       属性キー2: 値2,
  //       ... (いくつでも)
  //     }
  //   }
  
  var ret = {
    'img_url': './A-10569-685_C0034988.jpg', // https://colbase.nich.go.jp/media/tnm/A-10569-685/image/slideshow_s/A-10569-685_C0034988.jpg
    'title': get_randint(100),
    'atts': {
      'att1': get_randint(100),
      'att2': get_randint(100),
      'att3': get_randint(100),
      'att4': get_randint(100),
    },
  };
  return ret;
}

function make_dummy_dataset(num){
  // 適当なコンテンツデータから適当な問題を作る
  
  var ret = [];
  
  for(let i=0; i<num; i++){
    var _new = make_dummy_data();
    if(i%2==1){
      _new.atts['att1'] = ret[ret.length-1].atts['att1'];
    }
    ret.push(_new);
  }
  
  return ret;
}

function make_demo_data_0(){
  var ret = [
    {// 0
      'img_url': 'https://colbase.nich.go.jp/media/tnm/A-10569-685/image/slideshow_s/A-10569-685_C0034988.jpg',
      'title': '冨嶽三十六景・神奈川沖浪裏', 'atts': {'作者': '葛飾北斎', '時代': '江戸時代', '所蔵': '東京国立博物館'},
      'url': 'https://jpsearch.go.jp/item/cobas-49296',
    },
    {// 1
      'img_url': 'https://www.fujibi.or.jp/assets/images/collection/thumb_c/thumb_c_00623_01.jpg',
      'title': '東海道五十三次　絵本駅路鈴', 'atts': {'作者': '葛飾北斎', '時代': '江戸時代', '所蔵': '東京富士美術館'},
      'url': 'https://jpsearch.go.jp/item/tfam_art_db-623',
    },
    {// 2
      'img_url': 'https://colbase.nich.go.jp/media/tnm/A-10569-7024/image/slideshow_s/A-10569-7024_C0004335.jpg',
      'title': '日本湊盡・長州下ノ関', 'atts': {'作者': '歌川広重', '時代': '江戸時代', '所蔵': '東京国立博物館'},
      'url': 'https://jpsearch.go.jp/item/cobas-55484',
    },
    {// 3
      'img_url': 'https://www.fujibi.or.jp/assets/images/collection/thumb_c/thumb_c_04336.jpg',
      'title': '東海道五拾三次之内　蒲原 夜之雪', 'atts': {'作者': '歌川広重', '時代': '江戸時代', '所蔵': '東京富士美術館'},
      'url': 'https://jpsearch.go.jp/item/tfam_art_db-4336',
    },
    {// 4
      'img_url': 'https://www.fujibi.or.jp/assets/images/collection/thumb_c/thumb_c_09801.jpg',
      'title': 'みかけハこハゐがとんだいゝ人だ', 'atts': {'作者': '歌川国芳', '時代': '江戸時代', '所蔵': '東京富士美術館'},
      'url': 'https://jpsearch.go.jp/item/tfam_art_db-9801',
    },
    {// 5
      'img_url': 'https://www.fujibi.or.jp/assets/images/collection/thumb_c/thumb_c_09112.jpg',
      'title': '鬼若力之助', 'atts': {'作者': '歌川国芳','時代': '江戸時代', '所蔵': '東京富士美術館'},
      'url': 'https://jpsearch.go.jp/item/tfam_art_db-9112',
    },
    {// 6
      'img_url': 'https://www.fujibi.or.jp/assets/images/collection/thumb_c/thumb_c_06513.jpg',
      'title': '神洲第一峰', 'atts': {'作者': '横山大観', '時代': '昭和時代', '所蔵': '東京富士美術館'},
      'url': 'https://jpsearch.go.jp/item/tfam_art_db-6513',
    },
    {// 7
      'img_url': 'https://www.fujibi.or.jp/assets/images/collection/thumb_c/thumb_c_06551.jpg',
      'title': '夜桜（花）', 'atts': {'作者': '横山大観', '時代': '昭和時代', '所蔵': '東京富士美術館'},
      'url': 'https://jpsearch.go.jp/item/tfam_art_db-6551',
    },
  ];
  return ret;
  
}

function fy_shuffle(arr){
  // Fisher-Yatesによる配列シャッフル
  
  var i, j, temp;
  arr = arr.slice();
  i = arr.length;
  if (i === 0) {
    return arr;
  }
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function num_cards(){
  // カード枚数
  
  return Number(document.getElementById('num_cards').value);
}

function get_tgt_att(){
  // マッチング対象の属性キー
  
  return document.getElementById('tgt_att').value;
}

function check_matching(selids){
  // 属性の値が一致するかチェック
  // 一致する場合にその属性キーと属性値を返す
  // 一致しない場合は空リストを返す
  // tgt_attが指定されているときは属性キー=tgt_attを対象に一致を探す
  // 指定されていないときはいずれかの属性で一致するかを調べる
  
  var cont_0 = cont_list[selids[0]]; // 初めの選択コンテンツ
  for(let i=0; i<Object.keys(cont_0.atts).length; i++){ // 初めの選択コンテンツの全属性について
    var k0 = Object.keys(cont_0.atts)[i]; // 属性キー
    var v0 = cont_0.atts[k0]; // 属性値
    
    if(tgt_att!=null && k0!=tgt_att){ // tgt_attが指定されているときはk0==tgt_att以外は飛ばす
      continue
    }
    
    var match = true; // 属性値について他の選択コンテンツ全てと一致するか
    for(let j=1; j<selids.length; j++){ // その他の全ての選択コンテンツについて
      var cont_j = cont_list[selids[j]];
      if(Object.keys(cont_j.atts).indexOf(k0)==-1){ // 他の選択コンテンツが属性キーを持たない
        match = false;
        break;
      }else if(cont_j.atts[k0]!=v0){ // 他の選択コンテンツと属性値が異なる
        match = false;
        break;
      }
    }
    
    if(match){ // 全ての選択コンテンツの属性値が一致
      return [k0,v0];
    }
  }
  return [];
}

function modify_modal(selids, matchs){
  // モーダルの編集
  
  var result_text = document.getElementById('result-text'); // 結果テキスト
  var result_info = document.getElementById('result-info'); // 結果詳細
  
  if(matchs.length==2){ // 属性値一致
    result_text.innerHTML = '<span class="font-weight-bold text-danger">○</span> あたり';
  }else{ // 属性値不一致
    result_text.innerHTML = '<span class="font-weight-bold text-primary">×</span> はずれ';
  }
  
  // 結果詳細の初期化
  while (result_info.firstChild) result_info.removeChild(result_info.firstChild);
  
  // 選択したコンテンツについて結果詳細用のカードを作る
  for(let i=0; i<selids.length; i++){
    var cont_dat = cont_list[selids[i]]; // コンテンツデータ
    var cont_card = make_card(cont_list[selids[i]]); // コンテンツカード
    cont_card.setAttribute('style', 'width: 40%; display: inline-block'); // カードスタイル
    
    // カードに属性データを追加
    var atts_list = document.createElement('ul');
    atts_list.setAttribute('class', 'list-group list-group-flush');
    for(let j=0; j<Object.keys(cont_dat.atts).length; j++){
      var att_k = Object.keys(cont_dat.atts)[j];
      var att_row = document.createElement('li');
      att_row.setAttribute('class', 'list-group-item bg-light');
      if(att_k==matchs[0]){ // 一致した属性
        att_row.innerHTML = '<span class="text-warning">'+att_k+' : '+cont_dat.atts[att_k]+'</span>';
      }else{ // 一致してない属性
        att_row.innerHTML = att_k+' : '+cont_dat.atts[att_k];
      }
      atts_list.appendChild(att_row);
    }
    cont_card.appendChild(atts_list);
    
    result_info.appendChild(cont_card);
  }
}

function modify_modal_info(cont_dat){
  // モーダルの編集 (全正解後データ)
  
  var result_text = document.getElementById('result-text'); // 結果テキスト
  var result_info = document.getElementById('result-info'); // 結果詳細
  
  result_text.innerHTML = '';
  
  // 結果詳細の初期化
  while (result_info.firstChild) result_info.removeChild(result_info.firstChild);
  
  // コンテンツについて結果詳細カードを作る
  var cont_card = make_card(cont_dat); // コンテンツカード
  cont_card.setAttribute('style', 'width: 40%; display: inline-block'); // カードスタイル
  
  // カードに属性データを追加
  var atts_list = document.createElement('ul');
  atts_list.setAttribute('class', 'list-group list-group-flush');
  for(let j=0; j<Object.keys(cont_dat.atts).length; j++){
    var att_k = Object.keys(cont_dat.atts)[j];
    var att_row = document.createElement('li');
    att_row.setAttribute('class', 'list-group-item bg-light');
    att_row.innerHTML = att_k+' : '+cont_dat.atts[att_k];
    atts_list.appendChild(att_row);
  }
  
  // URL情報を追加
  var att_row = document.createElement('li');
  att_row.setAttribute('class', 'list-group-item bg-light');
  att_row.innerHTML = '<a href="' + cont_dat.url + '" target="_blank" rel="noopener noreferrer">ジャパンサーチリンク</a>';
  atts_list.appendChild(att_row);
  
  cont_card.appendChild(atts_list);
  
  result_info.appendChild(cont_card);
}

function make_card(data){
  // カードを作成
  var card = document.createElement('div');
  card.setAttribute('class', 'card content-card m-1 bg-light');
  
  var img = document.createElement('img');
  img.setAttribute('class', 'bd-placeholder-img card-img-top light');
  img.setAttribute('src', data.img_url);
  //img.setAttribute('style', 'width: 100%; max-height: 200px;');
  img.setAttribute('style', 'max-height: 200px; object-fit: contain;');
  
  var cbody = document.createElement('div');
  cbody.setAttribute('class', 'card-body p-2');
  
  var ctitle = document.createElement('h6');
  ctitle.setAttribute('class', 'card-title m-1');
  ctitle.innerHTML = data.title;
  
  cbody.appendChild(ctitle);
  card.appendChild(img);
  card.appendChild(cbody);
  
  // console.log(card);
  return card;
}

function make_card_obj(data){
  // データからカードオブジェクトを作る
  
  // カードを作成
  var card = make_card(data);
  card.setAttribute('id', data.id); // idを追加
  card.setAttribute('style', 'width: 20%; display: inline-block'); // カードスタイル
  
  // カードにクリックイベントを追加
  card.onclick = function(){
    if(all_clear){ // 全正解しているとき
      modify_modal_info(cont_list[Number(this.id.slice(1,2))]);
      $('#result-modal').modal('toggle');
    }else if(match_list.indexOf(this.id)==-1){ // 正解してないのコンテンツカードに対してのみ
      // 選択状態の視覚効果ON/OFF
      // 選択リストの更新
      this.classList.toggle('border-primary');
      if(selected_list.indexOf(this.id)==-1){
        this.style.borderWidth = '8px';
        selected_list.push(this.id);
      }else{
        this.style.borderWidth = '';
        selected_list.splice(selected_list.indexOf(this.id), 1);
      }
      
      // console.log(selected_list.length);
      // 2枚目を選択したとき
      if(selected_list.length==2){
        // 選択コンテンツのインデックスリスト
        var selids = [];
        for(let i=0; i<selected_list.length; i++){
          selids.push(Number(selected_list[i].slice(1,2)));
        }
        // console.log(selids);
        
        // 選択コンテンツの属性値一致チェック
        matchs = check_matching(selids);
        // console.log(matchs);
        
        // 結果モーダル編集
        modify_modal(selids, matchs);
        // 結果モーダル表示
        $('#result-modal').modal('toggle');
        
        if(matchs.length==2){ // 選択コンテンツの属性値が一致したとき
          // 選択状態の解除
          for(let i=0; i<selids.length; i++){
            card_list[selids[i]].classList.toggle('border-primary');
            card_list[selids[i]].classList.toggle('border-warning');
            match_list.push(card_list[selids[i]].id);
          }
          
          if(match_list.length==num_cards()){
            all_clear = true;
          }
        }else{ // 選択コンテンツの属性値が不一致のとき
          // 選択状態の解除
          for(let i=0; i<selids.length; i++){
            card_list[selids[i]].classList.toggle('border-primary');
            card_list[selids[i]].style.borderWidth = '';
          }
        }
        selected_list = [];
      }
    }
    
  };
  
  return card;
}

function place_cards(){
  // カードを並べる
  
  // データの初期化
  cont_list = []; // コンテンツデータのリスト
  card_list = []; // コンテンツカードのリスト
  selected_list = []; // 選択状態のコンテンツidのリスト
  match_list = []; // 属性値が一致したコンテンツidのリスト
  tgt_att = get_tgt_att(); // 一致をチェックする属性のキー
  all_clear = false; // 全正解状態
  
  // カード置き場
  var playyard = document.getElementById('playyard');
  
  // カード置き場初期化
  while (playyard.firstChild) playyard.removeChild(playyard.firstChild);
  
  // コンテンツデータのリスト
  //cont_list = make_dummy_dataset(num_cards());
  cont_list = make_demo_data_0();
  
  // コンテンツデータをシャッフルして
  cont_list = fy_shuffle(cont_list);
  // コンテンツデータにidを付加
  for(let i=0; i<cont_list.length; i++){
    cont_list[i].id = 'c'+i;
    // console.log(cont_list[i]);
  }
  
  // カードを並べる
  card_list = []; // カードオブジェクトのリスト
  for(let i=0; i<cont_list.length; i++){
    var card = make_card_obj(cont_list[i]); // コンテンツデータのカードオブジェクト化
    card_list.push(card);
    playyard.appendChild(card); // カード置き場へのカードオブジェクト追加
  }
  
}

window.onload = function(){
};
