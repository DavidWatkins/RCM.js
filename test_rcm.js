var rcm = require('./rcm.js');

//****************************************************************************80

function test_rcm_main ( )
{
  process.stdout.write("\n");
  process.stdout.write("RCM_PRB\n");
  process.stdout.write("  C++ version\n");
  process.stdout.write("  Test the RCM library.\n");

  test01();
  test02();
  // test03();
  // test04();
  // test05();
  // test06();
  // test07();
  // test08();
  // test09();

  // test10();
  // test11();
  // test12();
//
//  Terminate.
//
  process.stdout.write("\n");
  process.stdout.write("RCM_PRB\n");
  process.stdout.write("  Normal end of execution.\n");
  process.stdout.write("\n");

  return 0;
}
//****************************************************************************80

function test01()
{
  var NODE_NUM = 20;
  var ADJ_MAX = (NODE_NUM * (NODE_NUM - 1));

  var adj = new Array(ADJ_MAX);
  var adj_num = { val: 0 };
  var adj_row = new Array(NODE_NUM+1);
  var i;
  var j;
  var k;
  var n_calls;
  var seed = { val: 123456789 };

  process.stdout.write("\n");
  process.stdout.write("TEST01\n");
  process.stdout.write("  ADJ_SET sets up an adjacency matrix incrementally.\n");

  //seed is modified in i4_uniform
  n_calls = rcm.i4_uniform ( 1, ADJ_MAX, seed );

  //adj_set modifies adj_num
  rcm.adj_set ( NODE_NUM, ADJ_MAX, adj_num, adj_row, adj, -1, -1 );

  process.stdout.write("\n");
  process.stdout.write("  Creating and recording adjacency information:\n");
  process.stdout.write("\n");

  for ( k = 1; k <= n_calls; k++ )
  {
    //seed is modified in i4_uniform
    i = rcm.i4_uniform ( 1, NODE_NUM, seed );
    j = rcm.i4_uniform ( 1, NODE_NUM, seed );

    process.stdout.write("  " + i.toString() + " " + j.toString() + "\n");

    //adj_set modified adj_num
    rcm.adj_set ( NODE_NUM, ADJ_MAX, adj_num, adj_row, adj, i, j );
  }

  rcm.adj_print ( NODE_NUM, adj_num, adj_row, adj, "  Random adjacency matrix:" );

  rcm.adj_show ( NODE_NUM, adj_num, adj_row, adj );

  return;
}

//****************************************************************************80

function graph_01_size (adj_num) {
  adj_num.val = 28;
  return 10;
}

function init_graph_01 ( node_num, adj_num, adj_row, adj ) {
  var adj_save = [
    4, 6,
    3, 5, 7, 10,
    2, 4, 5,
    1, 3, 6, 9,
    2, 3, 7,
    1, 4, 7, 8,
    2, 5, 6, 8,
    6, 7,
    4,
    2 ];

  var adj_row_save = [
    1, 3, 7, 10, 14, 17, 21, 25, 27, 28, 29
  ];
  var i;

  for ( i = 0; i < adj_num.val; i++ )
  {
    adj[i] = adj_save[i];
  }

  for ( i = 0; i < node_num + 1; i++ )
  {
    adj_row[i] = adj_row_save[i];
  }
  return; 
}

function test02 ( ) {
  var adj;
  var adj_num = { val: 0 };
  var adj_row;
  var bandwidth;
  var i;
  var node_num = 0;
  var perm;
  var perm_inv;

  process.stdout.write("\n");
  process.stdout.write("TEST02\n");
  process.stdout.write("  GENRCM reorders the nodes in a graph using\n");
  process.stdout.write("  the Reverse Cuthill McKee algorithm.\n");

  //graph_01_size modifies node_num and adj_num
  //Change this so it returns node_num, no modification should occur
  node_num = graph_01_size ( adj_num );

  adj_row =  new Array(node_num.val+1);
  adj = new Array(adj_num);
  perm = new Array(node_num.val);
  perm_inv = new Array(node_num.val);

  node_num = init_graph_01 ( node_num, adj_num, adj_row, adj );

  rcm.adj_print ( node_num, adj_num, adj_row, adj, "  Adjacency matrix:" );

  rcm.adj_show ( node_num, adj_num, adj_row, adj );

  bandwidth = rcm.adj_bandwidth ( node_num, adj_num, adj_row, adj );

  process.stdout.write("\n");
  process.stdout.write("  ADJ bandwidth = " + bandwidth + "\n");

  rcm.genrcm ( node_num, adj_num, adj_row, adj, perm );

  rcm.perm_inverse3 ( node_num, perm, perm_inv );

  process.stdout.write("\n");
  process.stdout.write("  The RCM permutation and inverse:\n");
  process.stdout.write("\n");

  for ( i = 0; i < node_num; i++ )
  {
    process.stdout.write("  " + (i + 1)
         + "  " + perm[i]
         + "  " + perm_inv[i] + "\n");
  }

  process.stdout.write("\n");
  process.stdout.write("  Permuted adjacency matrix:\n");
  process.stdout.write("\n");

  rcm.adj_perm_show ( node_num, adj_num, adj_row, adj, perm, perm_inv );

  bandwidth = rcm.adj_perm_bandwidth ( node_num, adj_num, adj_row, adj, perm, perm_inv );

  process.stdout.write("\n");
  process.stdout.write("  ADJ (permuted) bandwidth = " + bandwidth + "\n");

  return;
}
//****************************************************************************80

// void test03 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int bandwidth;
//   int hole_num;
//   int i;
//   int j;
//   int node;
//   int node_num;
//   double *node_xy;
//   int *perm;
//   int *perm_inv;
//   int seed;
//   int test;
//   int triangle_num;
//   int *triangle_neighbor;
//   int *triangle_node;

//   process.stdout.write("\n";
//   process.stdout.write("TEST03\n";
//   process.stdout.write("  GENRCM generates the Reverse Cuthill McKee ordering.\n";
//   process.stdout.write("\n";
//   process.stdout.write("  Do the test twice.  On the second test, randomly\n";
//   process.stdout.write("  permute the initial nodes.\n";

//   triangulation_order3_example2_size ( &node_num, &triangle_num, &hole_num );

//   for ( test = 1; test <= 2; test++ )
//   {
//     node_xy = new double[2*node_num];
//     triangle_node = new int[3*triangle_num];
//     triangle_neighbor = new int[3*triangle_num];

//     triangulation_order3_example2 ( node_num, triangle_num, node_xy,
//       triangle_node, triangle_neighbor );
// //
// //  Randomly permute the nodes.
// //
//     if ( test == 2 )
//     {
//       seed = 123456789;

//       perm = perm_uniform ( node_num, &seed );

//       i4vec_print ( node_num, perm, "  The random permutation:" );

//       for ( i = 0; i < 3; i++ )
//       {
//         for ( j = 0; j < triangle_num; j++ )
//         {
//           node = triangle_node[i+j*3];
//           triangle_node[i+j*3] = perm[node-1];
//         }
//       }
//       delete [] perm;
//     }

//     i4mat_transpose_print ( 3, triangle_num, triangle_node,
//       "  TRIANGLE_NODE:" );

//     adj_row = new int[node_num+1];

//     adj_num = triangulation_order3_adj_count ( node_num, triangle_num,
//       triangle_node, triangle_neighbor, adj_row );

//     adj = triangulation_order3_adj_set ( node_num, triangle_num, triangle_node,
//       triangle_neighbor, adj_num, adj_row );

//     adj_print ( node_num, adj_num, adj_row, adj, "  ADJ array:" );

//     bandwidth = adj_bandwidth ( node_num, adj_num, adj_row, adj );

//     process.stdout.write("\n";
//     process.stdout.write("  ADJ bandwidth = " << bandwidth << "\n";

//     perm = new int[node_num];

//     genrcm ( node_num, adj_num, adj_row, adj, perm );

//     i4vec_print ( node_num, perm, "  The RCM permutation:" );

//     perm_inv = new int[node_num];

//     perm_inverse3 ( node_num, perm, perm_inv );

//     bandwidth = adj_perm_bandwidth ( node_num, adj_num, adj_row, adj,
//       perm, perm_inv );

//     process.stdout.write("\n";
//     process.stdout.write("  Permuted ADJ bandwidth = " << bandwidth << "\n";

//     delete [] adj;
//     delete [] adj_row;
//     delete [] node_xy;
//     delete [] perm;
//     delete [] perm_inv;
//     delete [] triangle_neighbor;
//     delete [] triangle_node;
//   }
//   return;
// }
// //****************************************************************************80

// void test04 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int bandwidth;
//   int hole_num;
//   int i;
//   int j;
//   int node;
//   int node_num;
//   double *node_xy;
//   int *perm;
//   int *perm_inv;
//   int seed;
//   int triangle_num;
//   int *triangle_neighbor;
//   int *triangle_node;
//   int triangle_order = 6;

//   process.stdout.write("\n";
//   process.stdout.write("TEST04\n";
//   process.stdout.write("  GENRCM generates the Reverse Cuthill McKee ordering.\n";

//   triangulation_order6_example2_size ( &node_num, &triangle_num, &hole_num );

//   node_xy = new double[2*node_num];
//   triangle_node = new int[triangle_order*triangle_num];
//   triangle_neighbor = new int[3*triangle_num];

//   triangulation_order6_example2 ( node_num, triangle_num, node_xy,
//     triangle_node, triangle_neighbor );
// //
// //  Randomly permute the nodes.
// //
//   seed = 123456789;

//   perm = perm_uniform ( node_num, &seed );

//   i4vec_print ( node_num, perm, "  The random permutation:" );

//   for ( i = 0; i < triangle_order; i++ )
//   {
//     for ( j = 0; j < triangle_num; j++ )
//     {
//       node = triangle_node[i+j*triangle_order];
//       triangle_node[i+j*triangle_order] = perm[node-1];
//     }
//   }

//   i4mat_transpose_print ( triangle_order, triangle_num, triangle_node,
//     "  Permuted TRIANGLE_NODE" );

//   delete [] perm;

//   adj_row = new int[node_num+1];

//   adj_num = triangulation_order6_adj_count ( node_num, triangle_num,
//     triangle_node, triangle_neighbor, adj_row );

//   adj = triangulation_order6_adj_set ( node_num, triangle_num, triangle_node,
//     triangle_neighbor, adj_num, adj_row );

//   adj_print ( node_num, adj_num, adj_row, adj, "  ADJ array:" );

//   bandwidth = adj_bandwidth ( node_num, adj_num, adj_row, adj );

//   process.stdout.write("\n";
//   process.stdout.write("  ADJ bandwidth = " << bandwidth << "\n";

//   perm = new int[node_num];

//   genrcm ( node_num, adj_num, adj_row, adj, perm );

//   i4vec_print ( node_num, perm, "  The RCM permutation:" );

//   perm_inv = new int[node_num];

//   perm_inverse3 ( node_num, perm, perm_inv );

//   bandwidth = adj_perm_bandwidth ( node_num, adj_num, adj_row, adj,
//     perm, perm_inv );

//   process.stdout.write("\n";
//   process.stdout.write("  Permuted ADJ bandwidth = " << bandwidth << "\n";

//   delete [] adj;
//   delete [] adj_row;
//   delete [] node_xy;
//   delete [] perm;
//   delete [] perm_inv;
//   delete [] triangle_neighbor;
//   delete [] triangle_node;

//   return;
// }
// //****************************************************************************80

// void test05 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int node_num;

//   process.stdout.write("\n";
//   process.stdout.write("TEST05\n";
//   process.stdout.write("  GRAPH_01_SIZE returns the sizes for graph 1.\n";
//   process.stdout.write("  GRAPH_01_ADJ returns the adjacency for graph 1.\n";
//   process.stdout.write("  ADJ_PRINT prints the adjacency information.\n";

//   graph_01_size ( &node_num, &adj_num );

//   adj_row = new int[node_num+1];
//   adj = new int[adj_num];

//   graph_01_adj ( node_num, adj_num, adj_row, adj );

//   adj_print ( node_num, adj_num, adj_row, adj,
//     "  Adjacency for GRAPH_01:" );

//   adj_show ( node_num, adj_num, adj_row, adj );

//   delete [] adj;
//   delete [] adj_row;

//   return;
// }
// //****************************************************************************80

// void test06 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int i;
//   int j;
//   int *level;
//   int level_num;
//   int *level_row;
//   int *mask;
//   int node_num;
//   int root;
//   int seed = 123456789;

//   process.stdout.write("\n";
//   process.stdout.write("TEST06\n";
//   process.stdout.write("  LEVEL_SET computes the level sets of a graph,\n";
//   process.stdout.write("  given a root node (which defines level 1).\n";

//   graph_01_size ( &node_num, &adj_num );

//   adj_row = new int[node_num+1];
//   adj = new int[adj_num];

//   graph_01_adj ( node_num, adj_num, adj_row, adj );

//   adj_print ( node_num, adj_num, adj_row, adj, "  Adjacency matrix:" );

//   adj_show ( node_num, adj_num, adj_row, adj );
// //
// //  Choose different roots.
// //
//   level = new int[node_num];
//   level_row = new int[node_num+1];
//   mask = new int[node_num];

//   for ( i = 1; i <= 3; i++ )
//   {
//     root = i4_uniform ( 1, node_num, &seed );

//     for ( j = 0; j < node_num; j++ )
//     {
//       mask[j] = 1;
//     }

//     level_set ( root, adj_num, adj_row, adj, mask, &level_num,
//       level_row, level, node_num );

//     level_set_print ( node_num, level_num, level_row, level );
//   }

//   delete [] adj;
//   delete [] adj_row;
//   delete [] level;
//   delete [] level_row;
//   delete [] mask;

//   return;
// }
// //****************************************************************************80

// void test07 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int i;
//   int j;
//   int *level;
//   int level_num;
//   int *level_row;
//   int *mask;
//   int node_num;
//   int root;
//   int seed = 123456789;

//   process.stdout.write("\n";
//   process.stdout.write("TEST07\n";
//   process.stdout.write("  ROOT_FIND is given a node in the graph,\n";
//   process.stdout.write("  and returns a better node to use as a starting\n";
//   process.stdout.write("  point for reordering.\n";

//   graph_01_size ( &node_num, &adj_num );

//   adj_row = new int[node_num+1];
//   adj = new int[adj_num];

//   graph_01_adj ( node_num, adj_num, adj_row, adj );

//   adj_print ( node_num, adj_num, adj_row, adj, "  Adjacency matrix:" );

//   adj_show ( node_num, adj_num, adj_row, adj );

//   level = new int[node_num];
//   level_row = new int[node_num+1];
//   mask = new int[node_num];

//   for ( i = 1; i <= node_num; i++ )
//   {
//     root = i;

//     process.stdout.write("\n";
//     process.stdout.write("  Starting root =    " << root << "\n";

//     for ( j = 0; j < node_num; j++ )
//     {
//       mask[j] = 1;
//     }

//     root_find ( &root, adj_num, adj_row, adj, mask, &level_num,
//       level_row, level, node_num );

//     process.stdout.write("  Suggested root =   " << root << "\n";
//     process.stdout.write("  Number of levels = " << level_num << "\n";
//   }

//   delete [] adj;
//   delete [] adj_row;
//   delete [] level;
//   delete [] level_row;
//   delete [] mask;

//   return;
// }
// //****************************************************************************80

// void test08 ( )
// {
//   int adj_num;
//   int *adj_row;
//   int hole_num;
//   int node_num;
//   double *node_xy;
//   int triangle_num;
//   int *triangle_neighbor;
//   int *triangle_node;

//   process.stdout.write("\n";
//   process.stdout.write("TEST08\n";
//   process.stdout.write("  TRIANGULATION_ORDER3_ADJ_COUNT counts the (lower)\n";
//   process.stdout.write("  adjacencies defined by a triangulation.\n";

//   triangulation_order3_example2_size ( &node_num, &triangle_num, &hole_num );

//   node_xy = new double[2*node_num];
//   triangle_node = new int[3*triangle_num];
//   triangle_neighbor = new int[3*triangle_num];

//   triangulation_order3_example2 ( node_num, triangle_num, node_xy,
//     triangle_node, triangle_neighbor );

//   i4mat_transpose_print ( 3, triangle_num, triangle_node,
//     "  TRIANGLE_NODE" );

//   adj_row = new int[node_num+1];

//   adj_num = triangulation_order3_adj_count ( node_num, triangle_num,
//     triangle_node, triangle_neighbor, adj_row );

//   i4vec_print ( node_num+1, adj_row, "  ADJ_ROW" );

//   delete [] adj_row;
//   delete [] node_xy;
//   delete [] triangle_neighbor;
//   delete [] triangle_node;

//   return;
// }
// //****************************************************************************80

// void test09 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int bandwidth;
//   int hole_num;
//   int node_num;
//   double *node_xy;
//   int triangle_num;
//   int *triangle_neighbor;
//   int *triangle_node;

//   process.stdout.write("\n";
//   process.stdout.write("TEST09\n";
//   process.stdout.write("  TRIANGULATION_ORDER3_ADJ_SET sets the (lower)\n";
//   process.stdout.write("  adjacencies defined by a triangulation.\n";

//   triangulation_order3_example2_size ( &node_num, &triangle_num, &hole_num );

//   node_xy = new double[2*node_num];
//   triangle_node = new int[3*triangle_num];
//   triangle_neighbor = new int[3*triangle_num];

//   triangulation_order3_example2 ( node_num, triangle_num, node_xy,
//     triangle_node, triangle_neighbor );

//   i4mat_transpose_print ( 3, triangle_num, triangle_node,
//     "  TRIANGLE_NODE" );

//   adj_row = new int[node_num+1];

//   adj_num = triangulation_order3_adj_count ( node_num, triangle_num,
//     triangle_node, triangle_neighbor, adj_row );

//   adj = triangulation_order3_adj_set ( node_num, triangle_num, triangle_node,
//     triangle_neighbor, adj_num, adj_row );

//   adj_print ( node_num, adj_num, adj_row, adj, "  ADJ array:" );

//   bandwidth = adj_bandwidth ( node_num, adj_num, adj_row, adj );

//   process.stdout.write("\n";
//   process.stdout.write("  ADJ bandwidth = " << bandwidth << "\n";

//   delete [] adj;
//   delete [] adj_row;
//   delete [] node_xy;
//   delete [] triangle_neighbor;
//   delete [] triangle_node;

//   return;
// }
// //****************************************************************************80

// void test10 ( )
// {
// # define TRIANGLE_ORDER 3
// # define TRIANGLE_NUM 16

//   int i;
//   int triangle_node[TRIANGLE_ORDER*TRIANGLE_NUM] = {
//      3,   4,   1,
//      3,   1,   2,
//      3,   2,   8,
//      2,   1,   5,
//      8,   2,  13,
//      8,  13,   9,
//      3,   8,   9,
//     13,   2,   5,
//      9,  13,   7,
//      7,  13,   5,
//      6,   7,   5,
//      9,   7,   6,
//     10,   9,   6,
//      6,   5,  12,
//     11,   6,  12,
//     10,   6,  11 };
//   int *triangle_neighbor;

//   process.stdout.write("\n";
//   process.stdout.write("TEST10\n";
//   process.stdout.write("  For a triangulation of a set of nodes,\n";
//   process.stdout.write("  TRIANGULATION_NEIGHBOR_TRIANGLES determines the\n";
//   process.stdout.write("    adjacency relationships between triangles.\n";

//   i4mat_transpose_print ( TRIANGLE_ORDER, TRIANGLE_NUM, triangle_node,
//     "  Triangles:" );

//   triangle_neighbor = triangulation_neighbor_triangles ( TRIANGLE_ORDER,
//     TRIANGLE_NUM, triangle_node );

//   i4mat_transpose_print ( 3, TRIANGLE_NUM, triangle_neighbor,
//     "  Triangle neighbors:" );

//   delete [] triangle_neighbor;

//   return;
// # undef TRIANGLE_NUM
// # undef TRIANGLE_ORDER
// }
// //****************************************************************************80

// void test11 ( )
// {
//   int adj_num;
//   int *adj_row;
//   int hole_num;
//   int node_num;
//   double *node_xy;
//   int triangle_num;
//   int *triangle_neighbor;
//   int *triangle_node;

//   process.stdout.write("\n";
//   process.stdout.write("TEST11\n";
//   process.stdout.write("  TRIANGULATION_ORDER6_ADJ_COUNT counts the (lower)\n";
//   process.stdout.write("  adjacencies defined by a triangulation.\n";

//   triangulation_order6_example2_size ( &node_num, &triangle_num, &hole_num );

//   node_xy = new double[2*node_num];
//   triangle_node = new int[6*triangle_num];
//   triangle_neighbor = new int[3*triangle_num];

//   triangulation_order6_example2 ( node_num, triangle_num, node_xy,
//     triangle_node, triangle_neighbor );

//   adj_row = new int[node_num+1];

//   adj_num = triangulation_order6_adj_count ( node_num, triangle_num,
//     triangle_node, triangle_neighbor, adj_row );

//   i4vec_print ( node_num+1, adj_row, "  ADJ_ROW" );

//   delete [] adj_row;
//   delete [] node_xy;
//   delete [] triangle_neighbor;
//   delete [] triangle_node;

//   return;
// }
// //****************************************************************************80

// void test12 ( )
// {
//   int *adj;
//   int adj_num;
//   int *adj_row;
//   int bandwidth;
//   int hole_num;
//   int node_num;
//   double *node_xy;
//   int triangle_num;
//   int *triangle_neighbor;
//   int *triangle_node;

//   process.stdout.write("\n";
//   process.stdout.write("TEST12\n";
//   process.stdout.write("  TRIANGULATION_ORDER6_ADJ_SET sets the (lower)\n";
//   process.stdout.write("  adjacencies defined by a triangulation.\n";

//   triangulation_order6_example2_size ( &node_num, &triangle_num, &hole_num );

//   node_xy = new double[2*node_num];
//   triangle_node = new int[6*triangle_num];
//   triangle_neighbor = new int[3*triangle_num];

//   triangulation_order6_example2 ( node_num, triangle_num, node_xy,
//     triangle_node, triangle_neighbor );

//   i4mat_transpose_print ( 6, triangle_num, triangle_node,
//     "  TRIANGLE_NODE" );

//   adj_row = new int[node_num+1];

//   adj_num = triangulation_order6_adj_count ( node_num, triangle_num, triangle_node,
//     triangle_neighbor, adj_row );

//   adj = new int [adj_num];

//   adj = triangulation_order6_adj_set ( node_num, triangle_num, triangle_node,
//     triangle_neighbor, adj_num, adj_row );

//   adj_print ( node_num, adj_num, adj_row, adj, "  ADJ array:" );

//   bandwidth = adj_bandwidth ( node_num, adj_num, adj_row, adj );

//   process.stdout.write("\n";
//   process.stdout.write("  ADJ bandwidth = " << bandwidth << "\n";

//   delete [] adj;
//   delete [] adj_row;
//   delete [] node_xy;
//   delete [] triangle_neighbor;
//   delete [] triangle_node;

//   return;
// }

test_rcm_main();