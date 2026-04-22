import { useState, useEffect } from "react";
import { Check, X, ChevronRight, RotateCcw, Trophy, Target, AlertCircle, Code2, Home, BarChart3 } from "lucide-react";

// ===== 問題データ =====
const PROBLEMS = {
    c: {
        name: "C",
        color: "#06b6d4",
        topics: {
            basics: {
                name: "基礎文法", problems: [
                    {
                        id: "c-b-1", type: "predict", q: "このプログラムの出力は?", code: `int a = 5;\nint b = 3;\nprintf("%d", a / b);`,
                        options: ["1", "1.666", "1.67", "エラー"], answer: 0,
                        explain: "C言語では int / int は整数除算。小数部分は切り捨てられるので 5/3 = 1 になる。1.666を得たいなら(float)a/bなどキャストが必要。"
                    },
                    {
                        id: "c-b-2", type: "predict", q: "このプログラムの出力は?", code: `int x = 10;\nx += 5;\nx *= 2;\nprintf("%d", x);`,
                        options: ["20", "25", "30", "40"], answer: 2,
                        explain: "x += 5 で x は 15、x *= 2 で x は 30 になる。複合代入演算子の計算順を追うことがポイント。"
                    },
                    {
                        id: "c-b-3", type: "fill", q: "「変数 n が偶数なら\"even\"、奇数なら\"odd\"を出力」する空欄に入るのは?", code: `if (n ___ 0) {\n  printf("even");\n} else {\n  printf("odd");\n}`,
                        options: ["% 2 ==", "/ 2 ==", "== 2 %", "mod 2 =="], answer: 0,
                        explain: "% は剰余演算子。n を 2 で割った余りが 0 なら偶数。C言語に mod キーワードはない。"
                    },
                    {
                        id: "c-b-4", type: "bug", q: "このコードの間違いは?", code: `int main() {\n  int x = 5\n  printf("%d", x);\n  return 0;\n}`,
                        options: ["printf のスペル", "int x の初期化", "x = 5 の後にセミコロンがない", "return 0 が不要"], answer: 2,
                        explain: "C言語では文の末尾にセミコロン ; が必須。int x = 5 の後に ; がない。"
                    },
                    {
                        id: "c-b-5", type: "predict", q: "このプログラムの出力は?", code: `int a = 7;\nint b = 2;\nprintf("%d %d", a % b, a / b);`,
                        options: ["1 3", "3 1", "3.5 3.5", "1 3.5"], answer: 0,
                        explain: "7 % 2 は余りで 1、7 / 2 は整数除算で 3。%d は整数用フォーマット。"
                    },
                    {
                        id: "c-b-6", type: "choice", q: "C言語で「真偽値」を表すのに最も一般的に使われるのは?", options: ["boolean型", "int型 (0が偽、非0が真)", "true/false型", "bit型"], answer: 1,
                        explain: "C言語には伝統的にbool型がなく、intで0=偽、非0=真を表す。C99以降は<stdbool.h>でboolも使えるが、intが今も一般的。"
                    },
                    {
                        id: "c-b-7", type: "predict", q: "このプログラムの出力は?", code: `int i = 5;\nint j = ++i;\nprintf("%d %d", i, j);`,
                        options: ["5 5", "5 6", "6 5", "6 6"], answer: 3,
                        explain: "前置インクリメント ++i は i を先に 6 にしてから値を返すので、j も 6 になる。後置 i++ なら j は 5 になる。"
                    },
                    {
                        id: "c-b-8", type: "fill", q: "絶対値を求める math.h の関数は?", code: `#include <math.h>\ndouble x = ___(-3.14);`,
                        options: ["abs", "fabs", "absolute", "mod"], answer: 1,
                        explain: "double用の絶対値は fabs、int用は abs(stdlib.h)。型によって関数が違うのがC言語の特徴。"
                    },
                ]
            },
            control: {
                name: "制御構造", problems: [
                    {
                        id: "c-c-1", type: "predict", q: "このループの出力は?", code: `for (int i = 0; i < 3; i++) {\n  printf("%d ", i);\n}`,
                        options: ["0 1 2 ", "1 2 3 ", "0 1 2 3 ", "1 2 "], answer: 0,
                        explain: "i < 3 なので i は 0, 1, 2 の3回ループ。条件を満たさなくなった時点で終了する。"
                    },
                    {
                        id: "c-c-2", type: "predict", q: "このプログラムの出力は?", code: `int n = 0;\nwhile (n < 5) {\n  n += 2;\n}\nprintf("%d", n);`,
                        options: ["4", "5", "6", "無限ループ"], answer: 2,
                        explain: "n=0→2→4→6 となり n < 5 が偽になって終了。最後の値は 6。"
                    },
                    {
                        id: "c-c-3", type: "bug", q: "このコードが無限ループする理由は?", code: `int i = 0;\nwhile (i < 10);\n{\n  i++;\n}`,
                        options: ["i の初期値が間違い", "while の条件が間違い", "while(...) の後にセミコロン ; がある", "{} が不要"], answer: 2,
                        explain: "while(i<10); のセミコロンで「何もしないループ」になる。i が更新されず無限ループ。;とブロックの取り違えは定番ミス。"
                    },
                    {
                        id: "c-c-4", type: "predict", q: "このプログラムの出力は?", code: `int x = 5;\nif (x > 0)\n  if (x > 10)\n    printf("A");\n  else\n    printf("B");`,
                        options: ["A", "B", "何も出力されない", "エラー"], answer: 1,
                        explain: "else は最も近い if にぶら下がる(dangling else)。x>10 は偽なので B が出力される。"
                    },
                    {
                        id: "c-c-5", type: "predict", q: "switch 文の出力は?", code: `int n = 2;\nswitch (n) {\n  case 1: printf("A");\n  case 2: printf("B");\n  case 3: printf("C");\n  default: printf("D");\n}`,
                        options: ["B", "BCD", "BC", "D"], answer: 1,
                        explain: "break がないのでフォールスルーする。case 2 から下の case 3、default まで全部実行されて BCD になる。"
                    },
                    {
                        id: "c-c-6", type: "fill", q: "1〜100の合計を求めるループの空欄は?", code: `int sum = 0;\nfor (int i = 1; ___; i++) {\n  sum += i;\n}`,
                        options: ["i < 100", "i <= 100", "i > 100", "i != 100"], answer: 1,
                        explain: "1〜100を含むので i <= 100。i < 100 だと 1〜99 の合計になり 100 が含まれない。"
                    },
                    {
                        id: "c-c-7", type: "predict", q: "このプログラムの出力は?", code: `for (int i = 0; i < 5; i++) {\n  if (i == 3) break;\n  printf("%d ", i);\n}`,
                        options: ["0 1 2 ", "0 1 2 3 ", "0 1 2 3 4 ", "3 "], answer: 0,
                        explain: "break はループを即終了。i==3 の時点で出力せずループ脱出するので 0 1 2 まで。"
                    },
                    {
                        id: "c-c-8", type: "predict", q: "このプログラムの出力は?", code: `for (int i = 0; i < 5; i++) {\n  if (i % 2 == 0) continue;\n  printf("%d ", i);\n}`,
                        options: ["0 2 4 ", "1 3 ", "0 1 2 3 4 ", "何も出力されない"], answer: 1,
                        explain: "continue は現在の反復をスキップ。偶数のときスキップされるので奇数の 1 3 だけ出力。"
                    },
                ]
            },
            arrays: {
                name: "配列と文字列", problems: [
                    {
                        id: "c-a-1", type: "predict", q: "このプログラムの出力は?", code: `int a[] = {10, 20, 30, 40};\nprintf("%d", a[2]);`,
                        options: ["10", "20", "30", "40"], answer: 2,
                        explain: "配列のインデックスは 0 から始まる。a[0]=10, a[1]=20, a[2]=30, a[3]=40。"
                    },
                    {
                        id: "c-a-2", type: "bug", q: "このコードの問題は?", code: `int a[5];\nfor (int i = 0; i <= 5; i++) {\n  a[i] = i;\n}`,
                        options: ["初期化ミス", "i <= 5 で配列外アクセス", "for の書き方", "int 型の問題"], answer: 1,
                        explain: "a[5] にアクセスしているが a[0]〜a[4] しか存在しない。配列外アクセスは未定義動作で危険。正しくは i < 5。"
                    },
                    {
                        id: "c-a-3", type: "fill", q: "文字列の長さを返す関数は?", code: `#include <string.h>\nchar s[] = "Hello";\nprintf("%d", ___ (s));`,
                        options: ["sizeof", "strlen", "length", "size"], answer: 1,
                        explain: "strlenは終端\\0までの文字数(5)を返す。sizeofは配列全体の容量で\\0含む6を返す。意味が違うので注意。"
                    },
                    {
                        id: "c-a-4", type: "predict", q: "このプログラムの出力は?", code: `char s[] = "abc";\nprintf("%c", s[1]);`,
                        options: ["a", "b", "c", "ab"], answer: 1,
                        explain: "s[0]='a', s[1]='b', s[2]='c', s[3]='\\0'。インデックス1はb。%cは1文字出力。"
                    },
                    {
                        id: "c-a-5", type: "predict", q: "配列のサイズは?", code: `int a[] = {1, 2, 3, 4, 5};\nprintf("%lu", sizeof(a) / sizeof(a[0]));`,
                        options: ["5", "20", "4", "1"], answer: 0,
                        explain: "sizeof(a)は配列全体のバイト数(20)、sizeof(a[0])は1要素のバイト数(4)。割ると要素数5になる。定番のイディオム。"
                    },
                    {
                        id: "c-a-6", type: "bug", q: "このコードの間違いは?", code: `char name[5];\nname = "Hello";`,
                        options: ["配列サイズが小さい", "配列に = で代入できない", "文字列の書き方", "\\0がない"], answer: 1,
                        explain: "C言語では配列に=で文字列を代入できない。strcpy(name, \"Hello\")を使う。また\"Hello\"は\\0含めて6バイト必要で配列サイズも足りない。"
                    },
                    {
                        id: "c-a-7", type: "predict", q: "2次元配列の出力は?", code: `int a[2][3] = {{1,2,3},{4,5,6}};\nprintf("%d", a[1][2]);`,
                        options: ["2", "3", "5", "6"], answer: 3,
                        explain: "a[1]は2行目{4,5,6}、そのインデックス2は6。行と列の順を取り違えやすいので注意。"
                    },
                    {
                        id: "c-a-8", type: "choice", q: "C言語の文字列「\"ABC\"」は実際には何バイト必要?", options: ["3バイト", "4バイト(終端\\0含む)", "6バイト", "可変"], answer: 1,
                        explain: "C言語の文字列はヌル終端文字\\0が必須。\"ABC\"は'A','B','C','\\0'の4バイト。これを忘れるとバッファオーバーフローの原因。"
                    },
                ]
            },
            functions: {
                name: "関数・ポインタ", problems: [
                    {
                        id: "c-f-1", type: "predict", q: "このプログラムの出力は?", code: `int add(int a, int b) {\n  return a + b;\n}\nint main() {\n  printf("%d", add(3, 4));\n}`,
                        options: ["7", "34", "12", "エラー"], answer: 0,
                        explain: "add(3,4)は3+4=7を返す。関数は仮引数に実引数の値をコピーして処理する(値渡し)。"
                    },
                    {
                        id: "c-f-2", type: "bug", q: "この swap 関数は値を交換できるか?", code: `void swap(int a, int b) {\n  int tmp = a;\n  a = b;\n  b = tmp;\n}`,
                        options: ["できる", "できない(値渡しなので)", "できる(参照渡しなので)", "コンパイルエラー"], answer: 1,
                        explain: "C言語は値渡し。関数内でのa,bの変更は呼び出し元に反映されない。正しくはポインタ版 swap(int *a, int *b) にする。"
                    },
                    {
                        id: "c-f-3", type: "predict", q: "このプログラムの出力は?", code: `int x = 10;\nint *p = &x;\nprintf("%d", *p);`,
                        options: ["10", "x のアドレス", "0", "エラー"], answer: 0,
                        explain: "&x は x のアドレス、*p はそのアドレスが指す値を取得(デリファレンス)。結果 x の値 10 が出力される。"
                    },
                    {
                        id: "c-f-4", type: "predict", q: "このプログラムの出力は?", code: `int x = 5;\nint *p = &x;\n*p = 20;\nprintf("%d", x);`,
                        options: ["5", "20", "アドレス値", "エラー"], answer: 1,
                        explain: "*p = 20 は p が指す場所(=x)に 20 を代入する。つまり x の値が 20 に変わる。ポインタで元の変数を書き換えられる。"
                    },
                    {
                        id: "c-f-5", type: "fill", q: "正しくswapするための空欄は?", code: `void swap(int *a, int *b) {\n  int tmp = ___;\n  *a = *b;\n  *b = tmp;\n}`,
                        options: ["a", "*a", "&a", "**a"], answer: 1,
                        explain: "ポインタ経由で値を交換するには * でデリファレンスする。*a でaが指す変数の値を取り出す。"
                    },
                    {
                        id: "c-f-6", type: "predict", q: "このプログラムの出力は?", code: `int arr[] = {10, 20, 30};\nint *p = arr;\nprintf("%d", *(p + 1));`,
                        options: ["10", "20", "30", "arrのアドレス"], answer: 1,
                        explain: "配列名は先頭アドレスなので p == &arr[0]。p+1 は arr[1] のアドレス、*(p+1) は arr[1] の値 20。ポインタ演算の基本。"
                    },
                    {
                        id: "c-f-7", type: "choice", q: "グローバル変数とローカル変数の違いで正しいのは?", options: ["グローバル変数は関数内で宣言する", "ローカル変数は関数が終わると破棄される", "どちらも初期値は必ず0", "プログラム全体で同じ変数名は使えない"], answer: 1,
                        explain: "ローカル変数はスタックに置かれ関数終了で破棄。グローバル変数はプログラム全体で生存。グローバルはデフォルトで0初期化、ローカルは未定義値なので注意。"
                    },
                    {
                        id: "c-f-8", type: "predict", q: "この関数を3回呼ぶと最後に何が返る?", code: `int count() {\n  static int n = 0;\n  n++;\n  return n;\n}\n// count(); count(); count();`,
                        options: ["1", "2", "3", "0"], answer: 2,
                        explain: "static変数は関数呼び出しを跨いで値が保持される。3回呼ぶとn=1→2→3と増えるので最後の戻り値は3。通常のローカル変数とは別物。"
                    },
                ]
            },
            advanced: {
                name: "応用", problems: [
                    {
                        id: "c-x-1", type: "predict", q: "この再帰関数 f(4) の結果は?", code: `int f(int n) {\n  if (n <= 1) return 1;\n  return n * f(n - 1);\n}`,
                        options: ["4", "10", "24", "無限ループ"], answer: 2,
                        explain: "これは階乗関数。f(4) = 4*f(3) = 4*3*f(2) = 4*3*2*f(1) = 4*3*2*1 = 24。"
                    },
                    {
                        id: "c-x-2", type: "predict", q: "この構造体を使った出力は?", code: `struct Point {\n  int x;\n  int y;\n};\nstruct Point p = {3, 5};\nprintf("%d", p.x + p.y);`,
                        options: ["3", "5", "8", "35"], answer: 2,
                        explain: "構造体のメンバにはドット演算子でアクセス。p.x=3, p.y=5 なので和は 8。"
                    },
                    {
                        id: "c-x-3", type: "choice", q: "malloc で確保したメモリを解放するのは?", options: ["delete", "free", "release", "自動で解放される"], answer: 1,
                        explain: "malloc で確保したヒープメモリは free で明示解放が必要。解放忘れはメモリリークの原因。C++のdeleteとは別物。"
                    },
                    {
                        id: "c-x-4", type: "bug", q: "このコードの問題点は?", code: `int *p = malloc(sizeof(int));\n*p = 100;\nprintf("%d", *p);\n// free(p) を書き忘れ`,
                        options: ["malloc の使い方", "sizeof の使い方", "free 忘れによるメモリリーク", "printf のフォーマット"], answer: 2,
                        explain: "malloc で確保したメモリは free しないとリーク。プログラム終了時にOSが回収するとはいえ、長時間動くプログラムでは致命的。"
                    },
                    {
                        id: "c-x-5", type: "predict", q: "このプログラムの出力は?", code: `#define SQ(x) x*x\nint main() {\n  printf("%d", SQ(2+3));\n}`,
                        options: ["25", "11", "10", "エラー"], answer: 1,
                        explain: "マクロは単純置換。SQ(2+3) は 2+3*2+3 = 2+6+3 = 11 になる。定番の落とし穴。括弧で ((x)*(x)) と囲むのが正解。"
                    },
                    {
                        id: "c-x-6", type: "predict", q: "ビット演算の結果は?", code: `int a = 0b1100;\nint b = 0b1010;\nprintf("%d", a & b);`,
                        options: ["0b0000 (0)", "0b1000 (8)", "0b1110 (14)", "0b0110 (6)"], answer: 1,
                        explain: "& はビットAND。両方1のビットだけ1になる。1100 AND 1010 = 1000 = 10進数で8。"
                    },
                    {
                        id: "c-x-7", type: "choice", q: "メモリを動的に確保する malloc の戻り値は何か?", options: ["確保したサイズ(int)", "成功/失敗のフラグ", "確保したメモリのアドレス(void*)", "文字列"], answer: 2,
                        explain: "mallocは汎用ポインタvoid*を返す。失敗時はNULL。実際に使う時は (int*)malloc(...)などにキャストすることが多い。"
                    },
                    {
                        id: "c-x-8", type: "predict", q: "このプログラムの出力は?", code: `int x = 5;\nprintf("%d", x == 5 ? 100 : 200);`,
                        options: ["5", "100", "200", "エラー"], answer: 1,
                        explain: "三項演算子 条件 ? 真の値 : 偽の値。x==5 は真なので 100 が出力される。短い条件分岐を書くのに便利。"
                    },
                ]
            },
        }
    },
    java: {
        name: "Java",
        color: "#f59e0b",
        topics: {
            basics: {
                name: "基礎文法", problems: [
                    {
                        id: "j-b-1", type: "predict", q: "このプログラムの出力は?", code: `int a = 7;\nint b = 2;\nSystem.out.println(a / b);`,
                        options: ["3.5", "3", "3.0", "エラー"], answer: 1,
                        explain: "Javaでも int / int は整数除算。7/2=3(切り捨て)。小数を得るなら (double)a / b のようにキャスト。"
                    },
                    {
                        id: "j-b-2", type: "predict", q: "このプログラムの出力は?", code: `String s = "Hello";\ns += " World";\nSystem.out.println(s);`,
                        options: ["Hello", "Hello World", " World", "エラー"], answer: 1,
                        explain: "Stringは += で連結できる。内部ではStringBuilderで結合されて新しい文字列が作られる。"
                    },
                    {
                        id: "j-b-3", type: "fill", q: "整数型の変数宣言で正しい空欄は?", code: `___ age = 20;`,
                        options: ["Int", "integer", "int", "Integer"], answer: 2,
                        explain: "プリミティブ型は小文字の int。Integerはラッパークラス(オブジェクト型)で別物。"
                    },
                    {
                        id: "j-b-4", type: "predict", q: "このプログラムの出力は?", code: `double d = 3.7;\nint i = (int) d;\nSystem.out.println(i);`,
                        options: ["3", "4", "3.7", "エラー"], answer: 0,
                        explain: "double→intへの明示キャストは小数部切り捨て(3.7→3)。四捨五入したいなら Math.round()。"
                    },
                    {
                        id: "j-b-5", type: "bug", q: "このコードのコンパイルエラーの原因は?", code: `int x = 10;\nString y = x;`,
                        options: ["x の型", "int から String への自動変換はできない", "文法ミス", "問題ない"], answer: 1,
                        explain: "Javaは厳格な型システム。int→String の自動変換はない。String.valueOf(x) や x + \"\" で変換する。"
                    },
                    {
                        id: "j-b-6", type: "predict", q: "このプログラムの出力は?", code: `String a = "5";\nString b = "3";\nSystem.out.println(a + b);`,
                        options: ["8", "53", "15", "エラー"], answer: 1,
                        explain: "Stringの+は文字列連結。数字の文字列でも連結されて \"53\" になる。数値計算にはInteger.parseInt()が必要。"
                    },
                    {
                        id: "j-b-7", type: "choice", q: "Javaで真偽値を扱う型は?", options: ["int (0と1)", "bool", "boolean", "bit"], answer: 2,
                        explain: "Javaには専用のboolean型があり、値はtrue/falseのみ。intでの代用はできない。"
                    },
                    {
                        id: "j-b-8", type: "predict", q: "このプログラムの出力は?", code: `int i = 5;\nint j = i++;\nSystem.out.println(i + " " + j);`,
                        options: ["5 5", "5 6", "6 5", "6 6"], answer: 2,
                        explain: "後置インクリメント i++ は先に値を返してからインクリメント。j=5(元の値)、その後 i=6 になる。"
                    },
                ]
            },
            control: {
                name: "制御構造", problems: [
                    {
                        id: "j-c-1", type: "predict", q: "このループの出力は?", code: `for (int i = 0; i < 3; i++) {\n  System.out.print(i + " ");\n}`,
                        options: ["0 1 2 ", "1 2 3 ", "0 1 2 3 ", "エラー"], answer: 0,
                        explain: "i=0から始まり i<3 の条件を満たす間ループ。0 1 2 の3回実行される。"
                    },
                    {
                        id: "j-c-2", type: "predict", q: "拡張for文(for-each)の出力は?", code: `int[] arr = {10, 20, 30};\nfor (int n : arr) {\n  System.out.print(n + " ");\n}`,
                        options: ["10 20 30 ", "0 1 2 ", "arr の参照", "エラー"], answer: 0,
                        explain: "for-each文は配列やコレクションの要素を順に取り出す。インデックスが不要な時に便利。"
                    },
                    {
                        id: "j-c-3", type: "predict", q: "このプログラムの出力は?", code: `int x = 10;\nif (x > 5)\n  if (x > 20)\n    System.out.println("A");\n  else\n    System.out.println("B");`,
                        options: ["A", "B", "何も出力されない", "エラー"], answer: 1,
                        explain: "else は最も近い if に対応する(dangling else)。x>5は真だがx>20は偽なのでB。"
                    },
                    {
                        id: "j-c-4", type: "predict", q: "switch 文の出力は?", code: `int n = 2;\nswitch (n) {\n  case 1: System.out.print("A"); break;\n  case 2: System.out.print("B");\n  case 3: System.out.print("C"); break;\n  default: System.out.print("D");\n}`,
                        options: ["B", "BC", "BCD", "D"], answer: 1,
                        explain: "case 2の後にbreakがないのでcase 3まで実行(フォールスルー)。case 3のbreakで抜けるのでBC。"
                    },
                    {
                        id: "j-c-5", type: "fill", q: "1〜10の合計を求める空欄は?", code: `int sum = 0;\nfor (int i = 1; ___; i++) {\n  sum += i;\n}`,
                        options: ["i < 10", "i <= 10", "i > 10", "i == 10"], answer: 1,
                        explain: "10 を含めたいので i <= 10。i < 10 だと 1〜9 の合計で 10 が含まれない。"
                    },
                    {
                        id: "j-c-6", type: "bug", q: "このコードが無限ループになる理由は?", code: `int i = 0;\nwhile (i < 5) {\n  System.out.println(i);\n  // i++ 忘れ\n}`,
                        options: ["whileの条件", "iの初期化", "iがインクリメントされない", "println"], answer: 2,
                        explain: "i が更新されないので i<5 が永遠に真で無限ループ。ループ変数の更新は忘れやすいバグ。"
                    },
                    {
                        id: "j-c-7", type: "predict", q: "このプログラムの出力は?", code: `for (int i = 1; i <= 10; i++) {\n  if (i == 5) break;\n  System.out.print(i + " ");\n}`,
                        options: ["1 2 3 4 ", "1 2 3 4 5 ", "5 ", "何も出力されない"], answer: 0,
                        explain: "break でループを抜ける。i==5 の時点で出力せず終了するので 1 2 3 4 まで。"
                    },
                    {
                        id: "j-c-8", type: "predict", q: "このプログラムの出力は?", code: `int i = 0;\ndo {\n  System.out.print(i + " ");\n  i++;\n} while (i < 3);`,
                        options: ["0 1 2 ", "1 2 3 ", "0 1 2 3 ", "何も出力されない"], answer: 0,
                        explain: "do-whileは最低1回実行される。0 1 2 の3回出力されてループ終了。条件を先に評価するwhileと区別。"
                    },
                ]
            },
            arrays: {
                name: "配列と文字列", problems: [
                    {
                        id: "j-a-1", type: "predict", q: "このプログラムの出力は?", code: `int[] a = {10, 20, 30};\nSystem.out.println(a.length);`,
                        options: ["2", "3", "30", "エラー"], answer: 1,
                        explain: "Javaの配列は length プロパティで要素数を取得。関数ではなくプロパティなので () をつけない。"
                    },
                    {
                        id: "j-a-2", type: "predict", q: "このプログラムの出力は?", code: `int[] a = new int[5];\nSystem.out.println(a[0]);`,
                        options: ["null", "0", "garbage値", "エラー"], answer: 1,
                        explain: "Javaでは配列を new で作ると自動で 0(数値型)や null(参照型)や false(boolean)で初期化される。Cとは違う。"
                    },
                    {
                        id: "j-a-3", type: "bug", q: "このコードの実行時エラーは?", code: `int[] a = {1, 2, 3};\nSystem.out.println(a[3]);`,
                        options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "ClassCastException", "問題ない"], answer: 1,
                        explain: "インデックスは 0〜2 までしか有効でない。a[3] は範囲外で ArrayIndexOutOfBoundsException が発生。"
                    },
                    {
                        id: "j-a-4", type: "fill", q: "文字列の長さを取得するメソッドは?", code: `String s = "Hello";\nSystem.out.println(s.___);`,
                        options: ["length", "length()", "size()", "count()"], answer: 1,
                        explain: "Stringのlength()はメソッド(括弧あり)。配列のlengthはプロパティ(括弧なし)。紛らわしいので要注意。"
                    },
                    {
                        id: "j-a-5", type: "predict", q: "このプログラムの出力は?", code: `String a = "Hello";\nString b = "Hello";\nSystem.out.println(a == b);`,
                        options: ["true", "false", "null", "エラー"], answer: 0,
                        explain: "String literalは同一プールに入るのでa==bは参照比較でtrue。ただし new String(\"Hello\") なら false。内容比較は equals() を使うのが安全。"
                    },
                    {
                        id: "j-a-6", type: "predict", q: "このプログラムの出力は?", code: `String a = new String("Hi");\nString b = new String("Hi");\nSystem.out.println(a.equals(b));`,
                        options: ["true", "false", "null", "エラー"], answer: 0,
                        explain: "equals() は中身を比較するので true。new で作ったStringは参照は違う(==はfalse)が中身は同じ。"
                    },
                    {
                        id: "j-a-7", type: "predict", q: "このプログラムの出力は?", code: `int[][] a = {{1,2,3},{4,5,6}};\nSystem.out.println(a[0][2] + a[1][1]);`,
                        options: ["7", "8", "9", "エラー"], answer: 1,
                        explain: "a[0][2]=3、a[1][1]=5、合計は8。2次元配列 a[行][列] の順番。"
                    },
                    {
                        id: "j-a-8", type: "fill", q: "文字列を大文字に変換するメソッドの空欄は?", code: `String s = "hello";\nSystem.out.println(s.___());`,
                        options: ["upperCase", "toUpper", "toUpperCase", "uppercase"], answer: 2,
                        explain: "toUpperCase() が正しい。Javaのメソッド名はキャメルケース(小文字始まり、単語の区切りを大文字)。"
                    },
                ]
            },
            classes: {
                name: "クラス・オブジェクト", problems: [
                    {
                        id: "j-o-1", type: "predict", q: "このクラスを使ったコードの出力は?", code: `class Dog {\n  String name;\n  Dog(String n) { name = n; }\n}\nDog d = new Dog("Pochi");\nSystem.out.println(d.name);`,
                        options: ["Dog", "Pochi", "null", "エラー"], answer: 1,
                        explain: "コンストラクタで name に \"Pochi\" を設定。d.name で参照すると \"Pochi\"。"
                    },
                    {
                        id: "j-o-2", type: "choice", q: "「継承」を表すJavaのキーワードは?", options: ["inherits", "extends", "implements", "super"], answer: 1,
                        explain: "クラスの継承は extends を使う。implements はインターフェース実装に使うので別物。"
                    },
                    {
                        id: "j-o-3", type: "predict", q: "このプログラムの出力は?", code: `class Animal {\n  void speak() { System.out.println("Sound"); }\n}\nclass Cat extends Animal {\n  void speak() { System.out.println("Meow"); }\n}\nAnimal a = new Cat();\na.speak();`,
                        options: ["Sound", "Meow", "両方", "エラー"], answer: 1,
                        explain: "ポリモーフィズム(動的ディスパッチ)。変数の型はAnimalでも実体はCatなのでCatのspeak()が呼ばれる。"
                    },
                    {
                        id: "j-o-4", type: "bug", q: "このコードの問題点は?", code: `class Point {\n  int x, y;\n}\nPoint p;\nSystem.out.println(p.x);`,
                        options: ["Pointクラスの定義", "p のインスタンス化忘れ(NullPointerException)", "int 型の問題", "問題ない"], answer: 1,
                        explain: "p は宣言しただけで new Point() でインスタンス化していない。pはnullなのでアクセス時にNullPointerException。"
                    },
                    {
                        id: "j-o-5", type: "choice", q: "Javaの「カプセル化」で使われる主な修飾子は?", options: ["public / final", "private / public", "static / void", "abstract / new"], answer: 1,
                        explain: "フィールドをprivateに、アクセス用のメソッド(getter/setter)をpublicにするのがカプセル化の典型パターン。"
                    },
                    {
                        id: "j-o-6", type: "predict", q: "このプログラムの出力は?", code: `class A {\n  static int count = 0;\n  A() { count++; }\n}\nnew A(); new A(); new A();\nSystem.out.println(A.count);`,
                        options: ["0", "1", "3", "エラー"], answer: 2,
                        explain: "static変数はクラス全体で共有される。new するたびにcount++されるので3回で3になる。"
                    },
                    {
                        id: "j-o-7", type: "choice", q: "「インターフェース」の役割として正しいのは?", options: ["実装を持つクラス", "メソッドの仕様だけを定義する型(契約)", "インスタンス化できるクラス", "配列の一種"], answer: 1,
                        explain: "インターフェースはメソッドのシグネチャ(仕様)だけを定義。実装するクラスが実際のコードを書く。Javaは多重継承はできないが複数インターフェースは実装可能。"
                    },
                    {
                        id: "j-o-8", type: "predict", q: "このコードの出力は?", code: `class Box<T> {\n  T val;\n}\nBox<String> b = new Box<>();\nb.val = "Hi";\nSystem.out.println(b.val);`,
                        options: ["Hi", "T", "null", "エラー"], answer: 0,
                        explain: "ジェネリクス Box<T> は型パラメータ。Box<String> として使えば val は String 型に。\"Hi\" が出力される。"
                    },
                ]
            },
            collections: {
                name: "コレクション・応用", problems: [
                    {
                        id: "j-x-1", type: "predict", q: "このプログラムの出力は?", code: `List<Integer> list = new ArrayList<>();\nlist.add(10);\nlist.add(20);\nlist.add(30);\nSystem.out.println(list.get(1));`,
                        options: ["10", "20", "30", "エラー"], answer: 1,
                        explain: "ArrayList の get(1) はインデックス1(2番目)の要素を返す。0始まりなので20が出力される。"
                    },
                    {
                        id: "j-x-2", type: "predict", q: "HashMap の出力は?", code: `Map<String, Integer> map = new HashMap<>();\nmap.put("a", 1);\nmap.put("b", 2);\nmap.put("a", 3);\nSystem.out.println(map.get("a"));`,
                        options: ["1", "2", "3", "null"], answer: 2,
                        explain: "同じキーでputすると値が上書きされる。最後のput(\"a\", 3)で上書きされているので3。"
                    },
                    {
                        id: "j-x-3", type: "choice", q: "ArrayList と LinkedList の違いで正しいのは?", options: ["どちらも全く同じ", "ArrayListはランダムアクセスが速い、LinkedListは挿入削除が速い", "LinkedListの方が常に速い", "ArrayListはスレッドセーフ"], answer: 1,
                        explain: "ArrayListは配列ベースでget(i)がO(1)、LinkedListはノード連結でgetはO(n)。ただし中間の追加削除はLinkedListの方が有利。"
                    },
                    {
                        id: "j-x-4", type: "predict", q: "このコードの出力は?", code: `try {\n  int[] a = new int[3];\n  a[5] = 10;\n} catch (Exception e) {\n  System.out.println("catch");\n}`,
                        options: ["10", "catch", "エラー終了", "何も出力されない"], answer: 1,
                        explain: "a[5]でArrayIndexOutOfBoundsExceptionが発生しcatchブロックに入る。例外処理の基本形。"
                    },
                    {
                        id: "j-x-5", type: "fill", q: "try-catch-finally で必ず実行される部分の空欄は?", code: `try {\n  // 処理\n} catch(Exception e) {\n  // 例外時\n} ___ {\n  // 必ず実行\n}`,
                        options: ["after", "finally", "ensure", "always"], answer: 1,
                        explain: "finally は try や catch の結果に関わらず必ず実行される。リソースのクローズなどによく使う。"
                    },
                    {
                        id: "j-x-6", type: "predict", q: "Stream APIの出力は?", code: `List<Integer> list = List.of(1,2,3,4,5);\nint sum = list.stream()\n  .mapToInt(Integer::intValue).sum();\nSystem.out.println(sum);`,
                        options: ["15", "5", "12345", "エラー"], answer: 0,
                        explain: "Stream APIで全要素の合計を計算。1+2+3+4+5=15。mapToIntでIntStreamに変換してsum()で合計。"
                    },
                    {
                        id: "j-x-7", type: "predict", q: "この再帰メソッド fact(5) の結果は?", code: `int fact(int n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}`,
                        options: ["15", "25", "120", "エラー"], answer: 2,
                        explain: "これは階乗関数 n!。fact(5) = 5*4*3*2*1 = 120。再帰は「終了条件」を必ず設けるのが重要。"
                    },
                    {
                        id: "j-x-8", type: "choice", q: "Javaのガベージコレクションの説明で正しいのは?", options: ["メモリを手動で解放する仕組み", "不要になったオブジェクトを自動で解放する仕組み", "変数を削除する命令", "ファイルを圧縮する機能"], answer: 1,
                        explain: "JavaはGCが不要オブジェクトを自動解放するので、Cのfreeは不要。その代わり参照を保持し続けると解放されずメモリリークになる点は注意。"
                    },
                ]
            },
        }
    }
};

const totalProblems = (lang) => Object.values(PROBLEMS[lang].topics).reduce((sum, t) => sum + t.problems.length, 0);

export default function CodeDrill() {
    const [screen, setScreen] = useState("home");
    const [lang, setLang] = useState(null);
    const [topicKey, setTopicKey] = useState(null);
    const [problems, setProblems] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showExplain, setShowExplain] = useState(false);
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState({});
    const [reviewMode, setReviewMode] = useState(false);

    useEffect(() => {
        try {
            const saved = window.localStorage?.getItem("code-quiz-history");
            if (saved) setHistory(JSON.parse(saved));
        } catch (e) { /* ignore */ }
    }, []);

    const saveHistory = (newResults) => {
        const updated = { ...history };
        newResults.forEach(r => {
            const key = `${r.lang}-${r.topic}`;
            if (!updated[key]) updated[key] = { correct: 0, total: 0, wrongIds: [] };
            updated[key].total++;
            if (r.correct) {
                updated[key].correct++;
                updated[key].wrongIds = (updated[key].wrongIds || []).filter(id => id !== r.id);
            } else {
                if (!(updated[key].wrongIds || []).includes(r.id)) {
                    updated[key].wrongIds = [...(updated[key].wrongIds || []), r.id];
                }
            }
        });
        setHistory(updated);
        try {
            window.localStorage?.setItem("code-quiz-history", JSON.stringify(updated));
        } catch (e) { /* ignore */ }
    };

    const startQuiz = (langKey, tKey) => {
        setLang(langKey);
        setTopicKey(tKey);
        const probs = tKey === "all"
            ? Object.entries(PROBLEMS[langKey].topics).flatMap(([k, t]) => t.problems.map(p => ({ ...p, topic: k })))
            : PROBLEMS[langKey].topics[tKey].problems.map(p => ({ ...p, topic: tKey }));
        setProblems(probs);
        setCurrentIdx(0);
        setSelected(null);
        setShowExplain(false);
        setResults([]);
        setReviewMode(false);
        setScreen("quiz");
    };

    const startReview = (langKey) => {
        const wrongs = [];
        Object.entries(history).forEach(([key, data]) => {
            if (key.startsWith(langKey + "-") && data.wrongIds) {
                const tKey = key.split("-")[1];
                if (PROBLEMS[langKey].topics[tKey]) {
                    data.wrongIds.forEach(id => {
                        const p = PROBLEMS[langKey].topics[tKey].problems.find(x => x.id === id);
                        if (p) wrongs.push({ ...p, topic: tKey });
                    });
                }
            }
        });
        if (wrongs.length === 0) {
            alert("復習する問題がありません。まず通常モードで解いてください。");
            return;
        }
        setLang(langKey);
        setProblems(wrongs);
        setCurrentIdx(0);
        setSelected(null);
        setShowExplain(false);
        setResults([]);
        setReviewMode(true);
        setScreen("quiz");
    };

    const submitAnswer = () => {
        if (selected === null) return;
        const current = problems[currentIdx];
        const correct = selected === current.answer;
        setResults([...results, { id: current.id, correct, topic: current.topic, lang }]);
        setShowExplain(true);
    };

    const next = () => {
        if (currentIdx + 1 < problems.length) {
            setCurrentIdx(currentIdx + 1);
            setSelected(null);
            setShowExplain(false);
        } else {
            saveHistory(results);
            setScreen("result");
        }
    };

    const reset = () => {
        setScreen("home");
        setLang(null);
        setTopicKey(null);
    };

    const themeColor = lang ? PROBLEMS[lang].color : "#f97316";

    // ============== HOME SCREEN ==============
    if (screen === "home") {
        return (
            <div className="min-h-screen bg-stone-950 text-stone-100" style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}>
                <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
                    backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}></div>

                <header className="relative border-b border-stone-800 px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-orange-400">◉ CODE.DRILL</span>
                    <span className="text-stone-500 hidden sm:block">Practice Terminal</span>
                    <span className="text-stone-400">v1.0</span>
                </header>

                <main className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
                    <div className="mb-16 md:mb-24">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-orange-400 mb-8">
                            ◉ PROGRAMMING DRILL TERMINAL
                        </p>
                        <h1 className="text-5xl md:text-7xl leading-[0.95] font-light tracking-tight mb-8" style={{ fontFamily: "'Georgia', serif" }}>
                            Read code,<br />
                            <em className="italic text-orange-400">predict output</em>,<br />
                            find the bug.
                        </h1>
                        <p className="text-stone-400 text-base md:text-lg max-w-xl leading-relaxed">
                            C言語とJavaの全分野を網羅した{totalProblems("c") + totalProblems("java")}問の演習ターミナル。
                            解いて、間違えて、復習して、単元ごとに弱点を潰していく。
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-800 border border-stone-800 mb-16">
                        {[
                            { label: "Languages", value: "2" },
                            { label: "Topics", value: "10" },
                            { label: "Problems", value: `${totalProblems("c") + totalProblems("java")}` },
                            { label: "Types", value: "4" },
                        ].map(s => (
                            <div key={s.label} className="bg-stone-950 p-6">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500 mb-3">{s.label}</p>
                                <p className="text-3xl md:text-4xl font-light" style={{ fontFamily: "'Georgia', serif" }}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-16">
                        <div className="flex items-baseline justify-between mb-8 border-b border-stone-800 pb-4">
                            <h2 className="text-2xl md:text-3xl font-light italic" style={{ fontFamily: "'Georgia', serif" }}>
                                Select Language
                            </h2>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">STEP 01</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(PROBLEMS).map(([key, p]) => {
                                const stat = Object.keys(PROBLEMS[key].topics).reduce((acc, tk) => {
                                    const h = history[`${key}-${tk}`];
                                    if (h) {
                                        acc.correct += h.correct;
                                        acc.total += h.total;
                                    }
                                    return acc;
                                }, { correct: 0, total: 0 });
                                const rate = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;

                                return (
                                    <button key={key}
                                        onClick={() => { setLang(key); setScreen("topics"); }}
                                        className="group text-left border border-stone-800 bg-stone-900 p-6 md:p-8 hover:border-stone-600 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: p.color }}>
                                                    ◉ {p.name}
                                                </p>
                                                <h3 className="text-3xl md:text-4xl font-light mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                                                    {p.name === "C" ? "C Language" : p.name}
                                                </h3>
                                            </div>
                                            <ChevronRight size={24} className="text-stone-600 group-hover:text-orange-400 group-hover:translate-x-1 transition" />
                                        </div>
                                        <div className="flex justify-between items-end pt-4 border-t border-stone-800">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500 mb-1">Problems</p>
                                                <p className="text-xl">{totalProblems(key)}</p>
                                            </div>
                                            {rate !== null && (
                                                <div className="text-right">
                                                    <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500 mb-1">Accuracy</p>
                                                    <p className="text-xl" style={{ color: p.color }}>{rate}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline justify-between mb-6 border-b border-stone-800 pb-4">
                            <h2 className="text-xl font-light italic" style={{ fontFamily: "'Georgia', serif" }}>Quick Actions</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button onClick={() => setScreen("stats")}
                                className="group flex items-center justify-between border border-stone-800 bg-stone-900 p-5 hover:border-orange-500/50 transition">
                                <div className="flex items-center gap-4">
                                    <BarChart3 size={20} className="text-orange-400" />
                                    <div className="text-left">
                                        <p className="text-sm">Stats Dashboard</p>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">単元別の弱点を可視化</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-stone-600 group-hover:translate-x-1 transition" />
                            </button>

                            <button onClick={() => {
                                if (Object.keys(history).length === 0) { alert("まず通常モードで問題を解いてください。"); return; }
                                const langs = Array.from(new Set(Object.keys(history).map(k => k.split("-")[0])));
                                if (langs.length === 1) { startReview(langs[0]); }
                                else { if (confirm("C言語の間違えた問題を復習しますか?(キャンセルでJava)")) startReview("c"); else startReview("java"); }
                            }}
                                className="group flex items-center justify-between border border-stone-800 bg-stone-900 p-5 hover:border-orange-500/50 transition">
                                <div className="flex items-center gap-4">
                                    <RotateCcw size={20} className="text-orange-400" />
                                    <div className="text-left">
                                        <p className="text-sm">Review Wrong Answers</p>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">間違えた問題だけを復習</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-stone-600 group-hover:translate-x-1 transition" />
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="relative border-t border-stone-800 px-6 py-6 text-[10px] uppercase tracking-[0.3em] text-stone-600 flex justify-between">
                    <span>◉ Personal Drill Edition</span>
                    <span>2026 / Built for XR Eng Path</span>
                </footer>
            </div>
        );
    }

    // ============== TOPIC SELECT ==============
    if (screen === "topics") {
        const p = PROBLEMS[lang];
        return (
            <div className="min-h-screen bg-stone-950 text-stone-100" style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}>
                <header className="border-b border-stone-800 px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
                    <button onClick={reset} className="flex items-center gap-2 hover:text-orange-400 transition">
                        <Home size={14} /> HOME
                    </button>
                    <span style={{ color: p.color }}>◉ {p.name}</span>
                    <span className="text-stone-500">STEP 02 / TOPIC</span>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: p.color }}>
                        ◉ {p.name} — Select Topic
                    </p>
                    <h2 className="text-4xl md:text-5xl font-light italic mb-12" style={{ fontFamily: "'Georgia', serif" }}>
                        Choose a topic.
                    </h2>

                    <div className="space-y-px bg-stone-800 border-y border-stone-800">
                        {Object.entries(p.topics).map(([key, t], idx) => {
                            const h = history[`${lang}-${key}`];
                            const rate = h && h.total > 0 ? Math.round((h.correct / h.total) * 100) : null;
                            return (
                                <button key={key}
                                    onClick={() => startQuiz(lang, key)}
                                    className="group w-full flex items-center justify-between bg-stone-950 hover:bg-stone-900 p-6 text-left transition">
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-stone-500 w-8">0{idx + 1}</span>
                                        <div>
                                            <h3 className="text-xl md:text-2xl mb-1" style={{ fontFamily: "'Georgia', serif" }}>{t.name}</h3>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                                                {t.problems.length} problems
                                                {rate !== null && <span className="ml-4">Accuracy {rate}%</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-stone-600 group-hover:text-orange-400 group-hover:translate-x-1 transition" />
                                </button>
                            );
                        })}

                        <button
                            onClick={() => startQuiz(lang, "all")}
                            className="group w-full flex items-center justify-between bg-orange-500/10 hover:bg-orange-500/20 p-6 text-left transition border-l-2 border-orange-400">
                            <div className="flex items-center gap-6">
                                <span className="text-xs text-orange-400 w-8">★</span>
                                <div>
                                    <h3 className="text-xl md:text-2xl mb-1 text-orange-400" style={{ fontFamily: "'Georgia', serif" }}>All Topics (Mix)</h3>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400/70">
                                        {totalProblems(lang)} problems — full challenge
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-orange-400 group-hover:translate-x-1 transition" />
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // ============== QUIZ SCREEN ==============
    if (screen === "quiz") {
        const current = problems[currentIdx];
        if (!current) return null;
        const correct = selected === current.answer;
        const progress = ((currentIdx + (showExplain ? 1 : 0)) / problems.length) * 100;
        const topicName = PROBLEMS[lang].topics[current.topic]?.name || "";

        const typeLabels = {
            predict: "OUTPUT PREDICT",
            fill: "FILL IN THE BLANK",
            bug: "FIND THE BUG",
            choice: "MULTIPLE CHOICE",
        };

        return (
            <div className="min-h-screen bg-stone-950 text-stone-100" style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}>
                <div className="fixed top-0 left-0 right-0 h-1 bg-stone-900 z-10">
                    <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: themeColor }}></div>
                </div>

                <header className="border-b border-stone-800 px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
                    <button onClick={reset} className="flex items-center gap-2 hover:text-orange-400 transition">
                        <Home size={14} /> EXIT
                    </button>
                    <span>
                        <span style={{ color: themeColor }}>{PROBLEMS[lang].name}</span>
                        <span className="text-stone-600 mx-3">/</span>
                        <span className="text-stone-400">{reviewMode ? "REVIEW" : topicName}</span>
                    </span>
                    <span className="text-stone-400">
                        {currentIdx + 1} / {problems.length}
                    </span>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex items-center gap-4 mb-6 text-[10px] uppercase tracking-[0.3em]">
                        <span className="px-3 py-1 border" style={{ borderColor: themeColor, color: themeColor }}>
                            {typeLabels[current.type]}
                        </span>
                        <span className="text-stone-500">Q{String(currentIdx + 1).padStart(2, "0")}</span>
                        {reviewMode && <span className="px-3 py-1 border border-red-500/50 text-red-400">REVIEW</span>}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-light leading-snug mb-8" style={{ fontFamily: "'Georgia', serif" }}>
                        {current.q}
                    </h2>

                    {current.code && (
                        <div className="mb-8 border border-stone-800 bg-stone-900">
                            <div className="border-b border-stone-800 px-4 py-2 flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 flex items-center gap-2">
                                    <Code2 size={12} /> {PROBLEMS[lang].name.toLowerCase()}
                                </span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-stone-700"></div>
                                    <div className="w-2 h-2 rounded-full bg-stone-700"></div>
                                    <div className="w-2 h-2 rounded-full bg-stone-700"></div>
                                </div>
                            </div>
                            <pre className="p-5 text-sm leading-relaxed overflow-x-auto text-stone-100 whitespace-pre">
                                {current.code}
                            </pre>
                        </div>
                    )}

                    <div className="space-y-3 mb-8">
                        {current.options.map((opt, idx) => {
                            let cls = "border-stone-800 hover:border-stone-600 bg-stone-900";
                            let indicator = null;
                            if (showExplain) {
                                if (idx === current.answer) {
                                    cls = "border-green-500 bg-green-500/10";
                                    indicator = <Check size={18} className="text-green-400" />;
                                } else if (idx === selected) {
                                    cls = "border-red-500 bg-red-500/10";
                                    indicator = <X size={18} className="text-red-400" />;
                                } else {
                                    cls = "border-stone-800 bg-stone-900 opacity-40";
                                }
                            } else if (selected === idx) {
                                cls = "border-orange-400 bg-orange-500/10";
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={showExplain}
                                    onClick={() => setSelected(idx)}
                                    className={`w-full text-left p-4 border ${cls} transition flex items-center justify-between gap-4 disabled:cursor-default`}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 w-6">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="text-base whitespace-pre-wrap">{opt}</span>
                                    </div>
                                    {indicator}
                                </button>
                            );
                        })}
                    </div>

                    {showExplain && (
                        <div className={`border-l-2 ${correct ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"} p-5 mb-8`}>
                            <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.3em]">
                                {correct ? (
                                    <><Check size={14} className="text-green-400" /><span className="text-green-400">CORRECT</span></>
                                ) : (
                                    <><X size={14} className="text-red-400" /><span className="text-red-400">INCORRECT</span></>
                                )}
                                <span className="text-stone-500 ml-2">— Explanation</span>
                            </div>
                            <p className="text-sm leading-relaxed text-stone-200" style={{ fontFamily: "'Georgia', serif" }}>
                                {current.explain}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-stone-800">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                            {showExplain ? "Ready for next" : selected === null ? "Select an answer" : "Submit to check"}
                        </div>
                        {!showExplain ? (
                            <button
                                onClick={submitAnswer}
                                disabled={selected === null}
                                className="px-8 py-3 text-xs uppercase tracking-[0.3em] disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-2"
                                style={{ background: themeColor, color: "#0c0a09" }}
                            >
                                SUBMIT <ChevronRight size={14} />
                            </button>
                        ) : (
                            <button
                                onClick={next}
                                className="px-8 py-3 text-xs uppercase tracking-[0.3em] bg-stone-100 text-stone-900 hover:bg-white transition flex items-center gap-2"
                            >
                                {currentIdx + 1 === problems.length ? "FINISH" : "NEXT"} <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    // ============== RESULT SCREEN ==============
    if (screen === "result") {
        const correctCount = results.filter(r => r.correct).length;
        const rate = Math.round((correctCount / results.length) * 100);
        const byTopic = {};
        results.forEach(r => {
            if (!byTopic[r.topic]) byTopic[r.topic] = { correct: 0, total: 0 };
            byTopic[r.topic].total++;
            if (r.correct) byTopic[r.topic].correct++;
        });

        const weakTopics = Object.entries(byTopic)
            .map(([k, v]) => ({ topic: k, rate: Math.round((v.correct / v.total) * 100), correct: v.correct, total: v.total }))
            .sort((a, b) => a.rate - b.rate);

        return (
            <div className="min-h-screen bg-stone-950 text-stone-100" style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}>
                <header className="border-b border-stone-800 px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-orange-400">◉ RESULT</span>
                    <span className="text-stone-500">{PROBLEMS[lang].name}{reviewMode ? " / REVIEW" : ""}</span>
                    <button onClick={reset} className="hover:text-orange-400 transition flex items-center gap-2">
                        <Home size={14} /> HOME
                    </button>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-orange-400 mb-6">
                        ◉ Session Complete
                    </p>
                    <h2 className="text-4xl md:text-6xl font-light italic mb-12" style={{ fontFamily: "'Georgia', serif" }}>
                        {rate >= 80 ? "Excellent work." : rate >= 60 ? "Good effort." : "Keep practicing."}
                    </h2>

                    <div className="border border-stone-800 bg-stone-900 p-8 md:p-12 mb-12">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">Your Score</p>
                                <p className="text-6xl md:text-8xl font-light" style={{ fontFamily: "'Georgia', serif", color: themeColor }}>
                                    {rate}<span className="text-3xl md:text-4xl text-stone-500">%</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">Correct</p>
                                <p className="text-3xl" style={{ fontFamily: "'Georgia', serif" }}>
                                    {correctCount}<span className="text-stone-500"> / {results.length}</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-2 bg-stone-800 overflow-hidden">
                            <div className="h-full transition-all duration-1000" style={{ width: `${rate}%`, background: themeColor }}></div>
                        </div>
                    </div>

                    {!reviewMode && weakTopics.length > 1 && (
                        <div className="mb-12">
                            <h3 className="text-xl italic mb-6 flex items-center gap-3" style={{ fontFamily: "'Georgia', serif" }}>
                                <Target size={18} className="text-orange-400" />
                                Topic Breakdown
                            </h3>
                            <div className="space-y-3">
                                {weakTopics.map(t => {
                                    const name = PROBLEMS[lang].topics[t.topic]?.name || t.topic;
                                    return (
                                        <div key={t.topic} className="border border-stone-800 bg-stone-900 p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">{name}</span>
                                                <span className="text-xs text-stone-400">
                                                    {t.correct} / {t.total} — {t.rate}%
                                                </span>
                                            </div>
                                            <div className="h-1 bg-stone-800 overflow-hidden">
                                                <div className="h-full transition-all duration-700" style={{
                                                    width: `${t.rate}%`,
                                                    background: t.rate >= 70 ? "#10b981" : t.rate >= 50 ? "#f59e0b" : "#ef4444"
                                                }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {weakTopics[0].rate < 70 && (
                                <div className="mt-6 border-l-2 border-orange-400 bg-orange-500/5 p-4 flex items-start gap-3">
                                    <AlertCircle size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-1">Focus Area</p>
                                        <p className="text-sm text-stone-200">
                                            <strong>{PROBLEMS[lang].topics[weakTopics[0].topic]?.name}</strong> の正答率が{weakTopics[0].rate}%。
                                            この単元を重点的に復習すると効率的です。
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3">
                        <button onClick={() => startQuiz(lang, topicKey || "all")}
                            className="py-4 border border-stone-700 hover:border-orange-400 hover:text-orange-400 transition text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <RotateCcw size={14} /> RETRY
                        </button>
                        <button onClick={reset}
                            className="py-4 bg-stone-100 text-stone-900 hover:bg-white transition text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <Home size={14} /> HOME
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // ============== STATS SCREEN ==============
    if (screen === "stats") {
        const entries = Object.entries(history);
        const hasData = entries.length > 0;

        return (
            <div className="min-h-screen bg-stone-950 text-stone-100" style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}>
                <header className="border-b border-stone-800 px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
                    <button onClick={reset} className="hover:text-orange-400 transition flex items-center gap-2">
                        <Home size={14} /> HOME
                    </button>
                    <span className="text-orange-400">◉ STATS</span>
                    <span className="text-stone-500">Overall</span>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-orange-400 mb-4">◉ Progress Dashboard</p>
                    <h2 className="text-4xl md:text-5xl font-light italic mb-12" style={{ fontFamily: "'Georgia', serif" }}>
                        Your weak points, visualized.
                    </h2>

                    {!hasData ? (
                        <div className="border border-stone-800 bg-stone-900 p-12 text-center">
                            <Trophy size={32} className="text-stone-600 mx-auto mb-4" />
                            <p className="text-stone-400">まだデータがありません。</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600 mt-2">Solve some problems first.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {["c", "java"].map(langKey => {
                                const langEntries = entries.filter(([k]) => k.startsWith(langKey + "-"));
                                if (langEntries.length === 0) return null;
                                const totalCorrect = langEntries.reduce((s, [, v]) => s + v.correct, 0);
                                const totalTotal = langEntries.reduce((s, [, v]) => s + v.total, 0);
                                const overallRate = Math.round((totalCorrect / totalTotal) * 100);

                                return (
                                    <div key={langKey}>
                                        <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-stone-800">
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: PROBLEMS[langKey].color }}>◉ {PROBLEMS[langKey].name}</span>
                                                <h3 className="text-2xl italic" style={{ fontFamily: "'Georgia', serif" }}>
                                                    {PROBLEMS[langKey].name === "C" ? "C Language" : PROBLEMS[langKey].name}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Overall</p>
                                                <p className="text-2xl" style={{ color: PROBLEMS[langKey].color }}>{overallRate}%</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            {langEntries.map(([key, v]) => {
                                                const tKey = key.split("-")[1];
                                                const name = PROBLEMS[langKey].topics[tKey]?.name || tKey;
                                                const rate = Math.round((v.correct / v.total) * 100);
                                                const wrongCount = (v.wrongIds || []).length;
                                                return (
                                                    <div key={key} className="border border-stone-800 bg-stone-900 p-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-base">{name}</span>
                                                            <div className="flex items-center gap-4 text-xs">
                                                                {wrongCount > 0 && (
                                                                    <span className="text-red-400">{wrongCount} wrong</span>
                                                                )}
                                                                <span className="text-stone-400">{v.correct}/{v.total}</span>
                                                                <span className="text-stone-100 font-medium">{rate}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-1 bg-stone-800 overflow-hidden">
                                                            <div className="h-full transition-all duration-500" style={{
                                                                width: `${rate}%`,
                                                                background: rate >= 70 ? "#10b981" : rate >= 50 ? "#f59e0b" : "#ef4444"
                                                            }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {langEntries.some(([, v]) => (v.wrongIds || []).length > 0) && (
                                            <button onClick={() => startReview(langKey)}
                                                className="mt-4 w-full py-3 border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 transition text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                                <RotateCcw size={14} /> {PROBLEMS[langKey].name}の間違えた問題だけ復習
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-12 pt-6 border-t border-stone-800">
                        <button onClick={() => {
                            if (confirm("学習履歴をすべてリセットしますか?(この操作は元に戻せません)")) {
                                setHistory({});
                                try { window.localStorage?.removeItem("code-quiz-history"); } catch (e) { }
                            }
                        }}
                            className="text-[10px] uppercase tracking-[0.3em] text-stone-600 hover:text-red-400 transition">
                            Reset all progress
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return null;
}