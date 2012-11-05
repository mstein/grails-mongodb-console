<div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container-fluid">
      <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>

      <div id="logo">
        <a class="brand" href="#">Mongo Viewer Plugin</a>
      </div>

      <div class="nav-collapse collapse">
        <ul class="nav pull-right">
          <li class="dropdown">
            <a href="#db" class="dropdown-toggle" data-toggle="dropdown">Mongo Instance Status <b class="caret"></b>
            </a>

            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
              <li><a href="#"><i class="icon-list"></i> Change server</a></li>
              <li><a href="#"><i class="icon-plus"></i> List replicas</a></li>
              <li class="divider"></li>
              <li class="nav-header">Connected on </li>
              <li class="foot"><a>sdd</a><a>zz</a></li>
            </ul>
          </li>
        </ul>

        <ul class="nav">
          <li ng-class="{active: !currentDB && !currentCollection && collections.length == 0}"><a ng-click="homepage()">Home</a></li>
          <li><a href="#gridfs">GridFS</a></li>
          <li><a href="#administrative">Administrative data</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>