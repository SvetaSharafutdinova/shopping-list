export const mockLists = [
    { id: "l1", name: "Weekend Shopping", isArchived: false, role: "OWNER", itemCount: 2 },
    { id: "l2", name: "Holiday List", isArchived: false, role: "MEMBER", itemCount: 3 },
    { id: "l3", name: "Old Archived", isArchived: true, role: "OWNER", itemCount: 1 }
  ];
  
  export const mockDetails = {
    l1: {
      id: "l1",
      name: "Weekend Shopping",
      isArchived: false,
      role: "OWNER",
      members: [
        { id: "u1", name: "You", role: "OWNER" },
        { id: "u2", name: "Petra", role: "MEMBER" }
      ],
      items: [
        { id: "i1", name: "Milk", isDone: true },
        { id: "i2", name: "Bread", isDone: false }
      ]
    },
    l2: {
      id: "l2",
      name: "Holiday List",
      isArchived: false,
      role: "MEMBER",
      members: [
        { id: "u1", name: "You", role: "MEMBER" },
        { id: "u3", name: "Adam", role: "OWNER" }
      ],
      items: [
        { id: "i3", name: "Water", isDone: false },
        { id: "i4", name: "Meat", isDone: false },
        { id: "i5", name: "Coffee", isDone: true }
      ]
    },
    l3: {
      id: "l3",
      name: "Old Archived",
      isArchived: true,
      role: "OWNER",
      members: [{ id: "u1", name: "You", role: "OWNER" }],
      items: [{ id: "i6", name: "Tea", isDone: true }]
    }
  };
  