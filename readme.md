# showclock.exe

このコマンドは無線LANアクセスポイントに接続しているパソコンのMACアドレスを

## 使い方

コマンドプロンプト、PowerShellで次のようにする。

```
showclock 'logfile name'
```

対象とするログファイルは次の形式のファイルです。

```plaintext
>show clock
00:00:39.624 JST Tue Nov 5 2024
>show wireless client summary
Number of Clients: 40
MAC Address    AP Name                                        Type ID   State             Protocol Method     Role
-------------------------------------------------------------------------------------------------------------------------
02bc.18a5.d3f4 JINBO-0703-a05                                 WLAN 2    Run               11n(2.4) None       Local
089d.f432.0f7d JINBO-0605-a04                                 WLAN 1    Run               11ac     Dot1x      Local
```
