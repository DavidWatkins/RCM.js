





//NOT WORKING

function i4vec_reverse ( n, a )
{
  var i;
  var j;

  for ( i = 0; i < n / 2; i++ )
  {
    j        = a[i];
    a[i]     = a[n-1-i];
    a[n-1-i] = j;
  }

  return;
}

function degree ( root, adj_num, adj_row, adj, mask, deg, iccsze, ls, node_num )
{
  var i;
  var ideg;
  var j;
  var jstop;
  var jstrt;
  var lbegin;
  var lvlend;
  var lvsize;
  var nbr;
  var node;
//
//  The sign of ADJ_ROW(I) is used to indicate if node I has been considered.
//
  ls[0] = root;
  adj_row[root-1] = -adj_row[root-1];
  lvlend = 0;
  iccsze = 1;
//
//  LBEGIN is the pointer to the beginning of the current level, and
//  LVLEND points to the end of this level.
//
  for ( ; ; )
  {
    lbegin = lvlend + 1;
    lvlend = iccsze;
//
//  Find the degrees of nodes in the current level,
//  and at the same time, generate the next level.
//
    for ( i = lbegin; i <= lvlend; i++ )
    {
      node = ls[i-1];
      jstrt = -adj_row[node-1];
      jstop = abs ( adj_row[node] ) - 1;
      ideg = 0;

      for ( j = jstrt; j <= jstop; j++ )
      {
        nbr = adj[j-1];

        if ( mask[nbr-1] != 0 )
        {
          ideg = ideg + 1;

          if ( 0 <= adj_row[nbr-1] )
          {
            adj_row[nbr-1] = -adj_row[nbr-1];
            iccsze = iccsze + 1;
            ls[iccsze-1] = nbr;
          }
        }
      }
      deg[node-1] = ideg;
    }
//
//  Compute the current level width.
//
    lvsize = iccsze - lvlend;
//
//  If the current level width is nonzero, generate another level.
//
    if ( lvsize == 0 )
    {
      break;
    }
  }
//
//  Reset ADJ_ROW to its correct sign and return.
//
  for ( i = 0; i < *iccsze; i++ )
  {
    node = ls[i] - 1;
    adj_row[node] = -adj_row[node];
  }

  return;
}

function rcm(root, adj_num, adj_row, adj, mask, perm, iccsze, node_num ) 
{
  var deg;
  var fnbr;
  var i;
  var j;
  var jstop;
  var jstrt;
  var k;
  var l;
  var lbegin;
  var lnbr;
  var lperm;
  var lvlend;
  var nbr;
  var node;

//
//  If node_num out of bounds, something is wrong.
//
  if ( node_num < 1 ) {
    console.log("\n");
    console.log("RCM - Fatal error!\n");
    console.log("  Unacceptable input value of NODE_NUM = " + node_num.toString() + "\n");
    exit ( 1 );
  }
//
//  If the root is out of bounds, something is wrong.
//
  if ( root < 1 || node_num < root )
  {
    console.log("\n");
    console.log("RCM - Fatal error!\n");
    console.log("  Unacceptable input value of ROOT = " + root.toString() + "\n");
    console.log("  Acceptable values are between 1 and " + node_num + ", inclusive.\n");
    exit ( 1 );
  }
//
//  Allocate memory for the degree array.
//
  deg = new Array(node_num);
//
//  Find the degrees of the nodes in the component specified by MASK and ROOT.
//
  degree ( root, adj_num, adj_row, adj, mask, deg, iccsze, perm, node_num );
//
//  If the connected component size is less than 1, something is wrong.
//
  if ( *iccsze < 1 )
  {
    console.log("\n");
    console.log("RCM - Fatal error!\n");
    console.log("  Connected component size ICCSZE returned from DEGREE as " + iccsze.toString() + "\n");
    exit ( 1 );
  }
//
//  Set the mask value for the root.
//
  mask[root-1] = 0;
//
//  If the connected component is a singleton, there is no ordering necessary.
//
  if ( iccsze == 1 )
  {
    return;
  }
//
//  Carry out the reordering.
//
//  LBEGIN and LVLEND point to the beginning and
//  the end of the current level respectively.
//
  lvlend = 0;
  lnbr = 1;

  while ( lvlend < lnbr )
  {
    lbegin = lvlend + 1;
    lvlend = lnbr;

    for ( i = lbegin; i <= lvlend; i++ )
    {
//
//  For each node in the current level...
//
      node = perm[i-1];
      jstrt = adj_row[node-1];
      jstop = adj_row[node] - 1;
//
//  Find the unnumbered neighbors of NODE.
//
//  FNBR and LNBR point to the first and last neighbors
//  of the current node in PERM.
//
      fnbr = lnbr + 1;

      for ( j = jstrt; j <= jstop; j++ )
      {
        nbr = adj[j-1];

        if ( mask[nbr-1] != 0 )
        {
          lnbr = lnbr + 1;
          mask[nbr-1] = 0;
          perm[lnbr-1] = nbr;
        }
      }
//
//  If no neighbors, skip to next node in this level.
//
      if ( lnbr <= fnbr )
      {
        continue;
      }
//
//  Sort the neighbors of NODE in increasing order by degree.
//  Linear insertion is used.
//
      k = fnbr;

      while ( k < lnbr )
      {
        l = k;
        k = k + 1;
        nbr = perm[k-1];

        while ( fnbr < l )
        {
          lperm = perm[l-1];

          if ( deg[lperm-1] <= deg[nbr-1] )
          {
            break;
          }

          perm[l] = lperm;
          l = l - 1;
        }
        perm[l] = nbr;
      }
    }
  }
//
//  We now have the Cuthill-McKee ordering.  
//  Reverse it to get the Reverse Cuthill-McKee ordering.
//
  i4vec_reverse ( *iccsze, perm );


  return;
}

function level_set ( root, adj_num, adj_row, adj, mask, level_num, level_row, level, node_num )
{
  var i;
  var iccsze;
  var j;
  var jstop;
  var jstrt;
  var lbegin;
  var lvlend;
  var lvsize;
  var nbr;
  var node;

  mask[root-1] = 0;
  level[0] = root;
  level_num = 0;
  lvlend = 0;
  iccsze = 1;
//
//  LBEGIN is the pointer to the beginning of the current level, and
//  LVLEND points to the end of this level.
//
  for ( ; ; )
  {
    lbegin = lvlend + 1;
    lvlend = iccsze;
    level_num = level_num + 1;
    level_row[level_num-1] = lbegin;
//
//  Generate the next level by finding all the masked neighbors of nodes
//  in the current level.
//
    for ( i = lbegin; i <= lvlend; i++ )
    {
      node = level[i-1];
      jstrt = adj_row[node-1];
      jstop = adj_row[node] - 1;

      for ( j = jstrt; j <= jstop; j++ )
      {
        nbr = adj[j-1];

        if ( mask[nbr-1] != 0 )
        {
          iccsze = iccsze + 1;
          level[iccsze-1] = nbr;
          mask[nbr-1] = 0;
        }
      }
    }
//
//  Compute the current level width (the number of nodes encountered.)
//  If it is positive, generate the next level.
//
    lvsize = iccsze - lvlend;

    if ( lvsize <= 0 )
    {
      break;
    }
  }

  level_row[level_num] = lvlend + 1;
//
//  Reset MASK to 1 for the nodes in the level structure.
//
  for ( i = 0; i < iccsze; i++ )
  {
    mask[level[i]-1] = 1;
  }

  return;
}

function root_find ( root, adj_num, adj_row, adj, mask, level_num, level_row, level, node_num )
{
  var iccsze;
  var j;
  var jstrt;
  var k;
  var kstop;
  var kstrt;
  var level_num2;
  var mindeg;
  var nabor;
  var ndeg;
  var node;
//
//  Determine the level structure rooted at ROOT.
//
  level_set ( root, adj_num, adj_row, adj, mask, level_num, level_row, level, node_num );
//
//  Count the number of nodes in this level structure.
//
  iccsze = level_row[level_num] - 1;
//
//  Extreme case:
//    A complete graph has a level set of only a single level.
//    Every node is equally good (or bad).
//
  if ( level_num == 1 )
  {
    return;
  }
//
//  Extreme case:
//    A "line graph" 0--0--0--0--0 has every node in its only level.
//    By chance, we've stumbled on the ideal root.
//
  if ( level_num == iccsze )
  {
    return;
  }
//
//  Pick any node from the last level that has minimum degree
//  as the starting point to generate a new level set.
//
  for ( ; ; )
  {
    mindeg = iccsze;

    jstrt = level_row[level_num-1];
    root = level[jstrt-1];

    if ( jstrt < iccsze )
    {
      for ( j = jstrt; j <= iccsze; j++ )
      {
        node = level[j-1];
        ndeg = 0;
        kstrt = adj_row[node-1];
        kstop = adj_row[node] - 1;

        for ( k = kstrt; k <= kstop; k++ )
        {
          nabor = adj[k-1];
          if ( 0 < mask[nabor-1] )
          {
            ndeg = ndeg + 1;
          }
        }

        if ( ndeg < mindeg )
        {
          root = node;
          mindeg = ndeg;
        }
      }
    }
//
//  Generate the rooted level structure associated with this node.
//
    level_set ( root, adj_num, adj_row, adj, mask, level_num2, level_row, level, node_num );
//
//  If the number of levels did not increase, accept the new ROOT.
//
    if ( level_num2 <= level_num )
    {
      break;
    }

    level_num = level_num2;
//
//  In the unlikely case that ROOT is one endpoint of a line graph,
//  we can exit now.
//
    if ( iccsze <= level_num )
    {
      break;
    }
  }

  return;
}


function genrcm ( node_num, adj_num, adj_row, adj, perm )
{
  var i;
  var iccsze;
  var level_num;
  var level_row;
  var mask;
  var num;
  var root;

  level_row = new int[node_num+1];
  mask = new int[node_num];

  for ( i = 0; i < node_num; i++ )
  {
    mask[i] = 1;
  }

  num = 1;

  for ( i = 0; i < node_num; i++ )
  {
//
//  For each masked connected component...
//
    if ( mask[i] != 0 )
    {
      root = i + 1;
//
//  Find a pseudo-peripheral node ROOT.  The level structure found by
//  ROOT_FIND is stored starting at PERM(NUM).
//
      root_find ( root, adj_num, adj_row, adj, mask, level_num,
        level_row, perm+num-1, node_num );
//
//  RCM orders the component using ROOT as the starting node.
//
      rcm ( root, adj_num, adj_row, adj, mask, perm+num-1, iccsze,
        node_num );

      num = num + iccsze;
//
//  We can stop once every node is in one of the connected components.
//
      if ( node_num < num )
      {
        return;
      }
    }
  }

  return;
}