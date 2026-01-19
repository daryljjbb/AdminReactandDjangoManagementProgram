import React, { useState } from 'react';
// Import necessary components from react-bootstrap
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

/**
 * A reusable component for creating navigable tabs using react-bootstrap.
 *
 * @param {Array<object>} tabs - An array of objects defining each tab.
 * Each object MUST have:
 * - eventKey (string): A unique identifier for the tab (e.g., 'home').
 * - title (string): The text displayed on the tab header (e.g., 'Home').
 * - content (ReactNode): The content to display when the tab is active.
 *
 * Example usage data structure:
 * const tabData = [
 * { eventKey: 'tab1', title: 'First Tab', content: <SomeComponent /> },
 * { eventKey: 'tab2', title: 'Second Tab', content: <AnotherComponent /> }
 * ];
 */
const ReusableTabs = ({ tabs }) => {
  // Use a state hook to manage which tab is currently active.
  // We initialize it to the eventKey of the first tab in the provided array,
  // or an empty string if the array is empty.
  const [activeKey, setActiveKey] = useState(tabs.length > 0 ? tabs[0].eventKey : '');

  // The Tab.Container is the parent component that manages the state of the tabs.
  // It uses the 'activeKey' and 'onSelect' props to control which tab is open.
  return (
    <Container className="p-0 border rounded shadow-lg">
      <Tab.Container 
        activeKey={activeKey} 
        onSelect={(k) => setActiveKey(k)} // 'k' is the eventKey of the tab that was clicked
      >
        {/* 1. The Tab Navigation Bar (The tab "headers")
          The 'Nav' component renders the list of tab titles.
        */}
        <Nav variant="tabs" className="bg-gray-50 border-b p-3">
          {tabs.map((tab) => (
            // Nav.Item wraps each individual clickable tab.
            <Nav.Item key={tab.eventKey}>
              {/* Nav.Link is the clickable button/link for the tab. */}
              <Nav.Link 
                eventKey={tab.eventKey}
                // The 'active' state is handled automatically by Tab.Container, 
                // but we can add custom classes if needed.
                className={`
                  ${tab.eventKey === activeKey ? 'font-bold bg-white' : 'hover:bg-gray-100'} 
                  transition-colors duration-200
                `}
                // Optionally disable a tab
                disabled={tab.disabled} 
              >
                {tab.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* 2. The Tab Content Area 
          This is where the actual content for the active tab is displayed.
        */}
        <Tab.Content className="p-4 bg-white">
          {tabs.map((tab) => (
            // Tab.Pane associates the content with a specific 'eventKey'.
            // Only the Tab.Pane matching the 'activeKey' will be visible.
            <Tab.Pane key={tab.eventKey} eventKey={tab.eventKey}>
              {/* Render the content provided in the tab object */}
              {tab.content}
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default ReusableTabs;