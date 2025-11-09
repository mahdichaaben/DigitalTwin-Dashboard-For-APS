import { Responsive, WidthProvider } from "react-grid-layout";
import Card from "@/components/PannelCard/Card";

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Reusable grid component
 * 
 * panels: Array of objects { key, title, component, visible }
 * currentLayouts: layouts for react-grid-layout
 * locked: boolean to lock grid drag/resize
 * onLayoutChange: callback for layout changes
 */
const DashboardGrid = ({ panels = [], currentLayouts, locked, onLayoutChange }) => (
  <ResponsiveGridLayout
    className="layout"
    layouts={currentLayouts}
    onLayoutChange={onLayoutChange}
    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
    rowHeight={100}
    margin={[5, 5]}
    isDraggable={!locked}
    isResizable={!locked}
    resizeHandles={["se"]}
    compactType="vertical"
    preventCollision={false}
    useCSSTransforms
    autoSize
  >
    {panels.map(({ key, title, component: Component, visible }) =>
      visible ? (
        <div key={key}>
          <Card title={title} locked={locked}>
            <Component />
          </Card>
        </div>
      ) : null
    )}
  </ResponsiveGridLayout>
);

export default DashboardGrid;
