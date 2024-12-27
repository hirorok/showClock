const { readFile } = require('fs');
const { join } = require('path');

// コマンドライン引数を使用して入力ファイルを設定
const args = process.argv.slice(2);
// console.log(args);

// 引数がない場合、エラーメッセージを表示して終了
if (args.length === 0) {
    console.error(`Usage: ${process.argv[1]} <input file path>`);
    process.exit(1);
}

//カレントディレクトリの取得
const currentDir = process.cwd();

const exePath = process.argv[1];
// console.log("argv:",process.argv);
// console.log("currentDir:",currentDir);

// const inputFilePath = join(__dirname, args[0]);
const inputFilePath = join(currentDir, args[0]);
// const inputFilePath2 = join(currentDir, args[0]);
// console.log(inputFilePath);
// console.log(inputFilePath2);

// 日時行の正規表現
// >show clock
// 00:00:39.624 JST Tue Nov 5 2024
const dateRegex = /(\d{2}:\d{2}:\d{2}\.\d{3}) JST (\w{3}) (\w{3}) (\d{1,2}) (\d{4})/;

// データ行の正規表現
// show wireless client summary
// 02bc.18a5.d3f4 JINBO-0703-a05                                 WLAN 2    Run               11n(2.4) None       Local
//
const dataRegex = /^([0-9a-f]{4}\.[0-9a-f]{4}\.[0-9a-f]{4})\s+([^\s]+)\s+(WLAN\s+\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/;

// ファイルを非同期で読み込む
readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('ファイルの読み込み中にエラーが発生しました:', err);
        return;
    }

    if (!data) {
        console.error('入力ファイルは空です。');
        return;
    }
    // console.log(inputFilePath);
    // 改行コードに対応して行を分割
    const lines = data.split(/\r?\n/);
    let logtime = '';
    const csvData = [];

    lines.forEach((line) => {
        // 日時行を検出して処理
        const dateMatch = dateRegex.exec(line);
        if (dateMatch) {
            const [ , time, day, month, dayOfMonth, year ] = dateMatch;
            const months = {
                Jan: '01', Feb: '02', Mar: '03', Apr: '04',
                May: '05', Jun: '06', Jul: '07', Aug: '08',
                Sep: '09', Oct: '10', Nov: '11', Dec: '12'
            };
            const monthNum = months[month];
            logtime = `${year}/${monthNum}/${dayOfMonth.padStart(2, '0')} ${time}`;
            return;
        }

        // データ行を検出して処理
        const dataMatch = dataRegex.exec(line);
        if (dataMatch) {
            const row = [...dataMatch.slice(1), logtime];
            csvData.push(row.map(col => col.trim())); // 各列の余分な空白を削除
        }
    });

    if (csvData.length === 0) {
        console.error('データ行が正規表現に一致しませんでした。入力データのフォーマットを確認してください。');
        return;
    }

    // CSV形式のデータを構築
    const csvContent = [
        'MAC Address,Device Name,Interface,Status,Mode,Security,Location,Log Time', // ヘッダー
        ...csvData.map(row => row.join(',')) // カンマ区切りに変換
    ].join('\n');

    // 標準出力に結果を出力
    console.log(csvContent);
});
