import React, { useState } from "react";
import ShoppingListOverviewRoute from "./routes/ShoppingListOverviewRoute";
import ShoppingListDetailRoute from "./routes/ShoppingListDetailRoute";

function App() {
  const [route, setRoute] = useState({ name: "overview", listId: null });

  if (route.name === "detail") {
    return <ShoppingListDetailRoute listId={route.listId} />;
  }

  return (
    <ShoppingListOverviewRoute
      onOpenList={(list) => setRoute({ name: "detail", listId: list.id })}
    />
  );
}

export default App;
