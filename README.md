# iNAZO-ogp-image

iNAZOのリンクをシェアした際に表示されるOGP IMAGEを動的に作成します。

# How to use

クエリから表示するデータを制御します。

| key | value | 備考 |
| --- | ----- | ---- |
| title(必須) | 講義名 | |
| data(必須) | A+ ~ Fの各人数 | A+, A, A-, B+, B, B-, C+, C, D, D-, Fの11項目でカンマ区切りの数値で入力 |
| subtitle | サブの情報 | 開催年度, 受講人数、平均GPAなど |
| width | 成績画像の横幅 | デフォルトは1200。 100 <= width <= 2000 (単位はpx)|
| height | 成績画像の縦幅 |デフォルトは630。 100 <= height <= 2000 (単位はpx)|

**example**
https://inazo-ogp-image.vercel.app/?data=1,2,3,4,5,1,2,3,4,5,1&title=test&subtitle=test

![サンプル画像](/iNAZO-grade.png)



# License
このソースコードは[MIT license](https://opensource.org/licenses/MIT)です。
