using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend_dash.Domain;

public class TaskFixedModule
    {

        public string Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }

        public FixedModule FixedModule { get; set; }

        public TaskFixedModule(string id,string name,int order) {
            Id=id;
            Name=name;
            Order=order;
        }


    }
