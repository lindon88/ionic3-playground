import {Component, ContentChildren, QueryList, AfterContentInit} from '@angular/core';
import {TabComponent} from "../tab/tab";

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    let activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on
    tab.active = true;
  }

}
