/* ------------------------------------------------------------------------ *

DASHBOARD LAYOUT
+-------+----+----+----+----+----+----+----+----+----+----+-------+
|pane |       .leftpanel       |          .rightpanel      |
|            |                        |                           |
|            |                        |                           |
|            |                        |                           |
+-------+----+----+----+----+----+----+----+----+----+----+-------+

    
CSS Notes:

GLOBAL STYLE IDEAS
every selector is set to display:flex; in the normalize.scss * { display:flex; flex-flow: row wrap; }
    - these are set on everything because they would be set on 75% of elements.







Component notes:

pane:
    This component can be used anywhere. It opens and closes via CSS .open on <app-root>.
    Toggling open/closed states can be controlled via its service
    Its content is authed content right now but should be updated to serve any content, anywhere.







Using BEM:



Design project:
    There is an example design-based Angular project that is being built to display all the common Recruitler design components and styles. 



