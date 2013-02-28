<div ng-controller="MonitoringCtrl">
    <div class="title-buttons">
        <div class="title">
            <span>Monitoring</span>
        </div>
    </div>

    <div class="monitoring-page" ng-show="log">
        <a class="close" ng-click="cancel()">×</a>
        <div class="log">
<pre>11:41:59 [initandlisten] connection accepted from 127.0.0.1:63400 #2
11:42:03 [initandlisten] connection accepted from 127.0.0.1:63401 #3
11:42:03 [initandlisten] connection accepted from 127.0.0.1:63402 #4
11:53:27 [clientcursormon] mem (MB) res:75 virt:2850 mapped:160
17:24:50 [initandlisten] connection accepted from 127.0.0.1:51652 #12
17:24:55 [initandlisten] connection accepted from 127.0.0.1:51653 #13
17:24:55 [initandlisten] connection accepted from 127.0.0.1:51654 #14
17:26:07 [initandlisten] connection accepted from 127.0.0.1:51662 #15
17:28:31 [clientcursormon] mem (MB) res:117 virt:2856 mapped:160
17:32:27 [initandlisten] connection accepted from 127.0.0.1:51696 #16
17:32:32 [initandlisten] connection accepted from 127.0.0.1:51697 #17
17:33:31 [clientcursormon] mem (MB) res:117 virt:2857 mapped:160
17:34:36 [initandlisten] connection accepted from 127.0.0.1:51705 #18
17:38:31 [clientcursormon] mem (MB) res:117 virt:2857 mapped:160</pre>
        </div>
    </div>

    <div class="monitoring">
        <h3>Log</h3>
        <div class="log">
<pre ng-click="showLog()">11:41:59 [initandlisten] connection accepted from 127.0.0.1:63400 #2
11:42:03 [initandlisten] connection accepted from 127.0.0.1:63401 #3
11:42:03 [initandlisten] connection accepted from 127.0.0.1:63402 #4
11:53:27 [clientcursormon] mem (MB) res:75 virt:2850 mapped:160</pre>
        </div>

        <div class="row-fluid">
            <div class="span6">
                <h3>Master Shard</h3>
                <ul>
                    <li>Version de mongodb : 2.2.0</li>
                    <li>Uptime : 2 days, 3 hours, 10 minutes</li>
                    <li>Server URL : 192.169.1.2:27017</li>
                </ul>
                <div class="memory">
                    <h3>Memory used</h3>
                    <div class="item">
                        <div class="progress">
                            <span class="label-behind">Replica 1 (10% used)</span>
                            <div class="bar" style="width: 10%;">
                                <span class="label-before">Replica 1 (10% used)</span>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="progress">
                            <span class="label-behind">Replica 1 (5% used)</span>
                            <div class="bar" style="width: 5%;">
                                <span class="label-before">Replica 1 (5% used)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="span6">
                <h3>Processus</h3>
                <table cellpadding="0" cellspacing="0" class="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th width="20px">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>PRO_AZJD</td>
                        <td width="20px">
                            <a href="#"><i class="icon-trash"></i></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>