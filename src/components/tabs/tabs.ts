import {Component, ContentChildren, QueryList} from '@angular/core';
import {TabComponent} from "../tab/tab";

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  // vars
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  /**
   * After init, get active tabs
   */
  ngAfterContentInit() {
    let activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  /**
   * Select tab`
   * @param tab
   */
  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on
    tab.active = true;
  }

}
