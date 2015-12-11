module.exports = {};

function adj_contains_ij ( node_num, adj_num, adj_row, adj, i, j ){
	var k;
	var khi;
	var klo;
	var value;
//
//  Symmetric entries are not stored.
//
if ( i == j )
{
	value = true;
	return value;
}
//
//  Illegal I, J entries.
//
if ( node_num < i )
{
	value = false;
	return value;
}
else if ( i < 1 )
{
	value = false;
	return value;
}
else if ( node_num < j )
{
	value = false;
	return value;
}
else if ( j < 1 )
{
	value = false;
	return value;
}
//
//  Search the adjacency entries already stored for row I,
//  to see if J has already been stored.
//
klo = adj_row[i-1];
khi = adj_row[i]-1;

for ( k = klo; k <= khi; k++ )
{
	if ( adj[k-1] == j )
	{
		value = true;
		return value;
	}
}
value = false;

return value;
}

function adj_insert_ij( node_num, adj_max, adj_num, adj_row, adj, i, j ) {
	var j_spot;
	var k;
//
//  A new adjacency entry must be made.
//  Check that we're not exceeding the storage allocation for ADJ.
//
if ( adj_max < adj_num.val + 1 ) {
	process.stdout.write("\n");
	process.stdout.write("ADJ_INSERT_IJ - Fatal error!\n");
	process.stdout.write("  All available storage has been used.\n");
	process.stdout.write("  No more information can be stored!\n");
	process.stdout.write("  This error occurred for \n");
	process.stdout.write("  Row I =    " + i + "\n");
	process.stdout.write("  Column J = " + j + "\n");
	exit ( 1 );
}
//
//  The action is going to occur between ADJ_ROW(I) and ADJ_ROW(I+1)-1:
//
j_spot = adj_row[i-1];

for ( k = adj_row[i-1]; k <= adj_row[i]-1; k++ )
{
	if ( adj[k-1] == j )
	{
		return;
	}
	else if ( adj[k-1] < j )
	{
		j_spot = k + 1;
	}
	else
	{
		break;
	}
}

for ( k = adj_num.val; j_spot <= k; k-- )
{
	adj[k] = adj[k-1];
}
adj[j_spot-1] = j;

for ( k = i; k <= node_num; k++ )
{
	adj_row[k] = adj_row[k] + 1;
}

adj_num.val = adj_num.val + 1;

return;
}

//adj_num is an object
function adj_set(node_num, adj_max, adj_num, adj_row, adj, irow, jcol) {
	var i;
//
//  Negative IROW or JCOL indicates the data structure should be initialized.
//
if ( irow < 0 || jcol < 0 )
{
	process.stdout.write("\n");
	process.stdout.write("ADJ_SET - Note:\n");
	process.stdout.write("  Initializing adjacency information.\n");
	process.stdout.write("  Number of nodes NODE_NUM =  " + node_num + "\n");
	process.stdout.write("  Maximum adjacency ADJ_MAX = " + adj_max + "\n");

	adj_num.val = 0;
	for ( i = 0; i < node_num + 1; i++ )
	{
		adj_row[i] = 1;
	}
	for ( i = 0; i < adj_max; i++ )
	{
		adj[i] = 0;
	}
	return;
}
//
//  Diagonal entries are not stored.
//
if ( irow == jcol )
{
	return;
}

if ( node_num < irow )
{
	process.stdout.write("\n");
	process.stdout.write("ADJ_SET - Fatal error!\n");
	process.stdout.write("  NODE_NUM < IROW.\n");
	process.stdout.write("  IROW =     " + irow + "\n");
	process.stdout.write("  NODE_NUM = " + node_num + "\n");
	exit ( 1 );
}
else if ( irow < 1 )
{
	process.stdout.write("\n");
	process.stdout.write("ADJ_SET - Fatal error!\n");
	process.stdout.write("  IROW < 1.\n");
	process.stdout.write("  IROW = " + irow + "\n");
	exit ( 1 );
}
else if ( node_num < jcol )
{
	process.stdout.write("\n");
	process.stdout.write("ADJ_SET - Fatal error!\n");
	process.stdout.write("  NODE_NUM < JCOL.\n");
	process.stdout.write("  JCOL =     " + jcol + "\n");
	process.stdout.write("  NODE_NUM = " + node_num + "\n");
	exit ( 1 );
}
else if ( jcol < 1 )
{
	process.stdout.write("\n");
	process.stdout.write("ADJ_SET - Fatal error!\n");
	process.stdout.write("  JCOL < 1.\n");
	process.stdout.write("  JCOL = " + jcol + "\n");
	exit ( 1 );
}

if ( !adj_contains_ij ( node_num, adj_num, adj_row, adj, irow, jcol ) )
{
	adj_insert_ij ( node_num, adj_max, adj_num, adj_row, adj, irow, jcol );
}

if ( !adj_contains_ij ( node_num, adj_num, adj_row, adj, jcol, irow ) )
{
	adj_insert_ij ( node_num, adj_max, adj_num, adj_row, adj, jcol, irow );
}

return;
}

function r4_abs ( x )
{
  var value;

  if ( 0.0 <= x )
  {
    value = x;
  }
  else
  {
    value = -x;
  }
  return value;
}

function r4_nint ( x )
{
  var value;

  if ( x < 0.0 )
  {
    value = -( r4_abs ( x ) + 0.5 );
  }
  else
  {
    value =  ( r4_abs ( x ) + 0.5 );
  }

  return value;
}

function i4_max ( i1, i2 )
{
  if ( i2 < i1 )
  {
    return i1;
  }
  else
  {
    return i2;
  }

}

function i4_min ( i1, i2 )
{
  if ( i1 < i2 )
  {
    return i1;
  }
  else
  {
    return i2;
  }

}

function i4_uniform ( a, b, seed ) {
  var k;
  var r;
  var value;

  if ( seed.val == 0 )
  {
    process.stdout.write("\n");
    process.stdout.write("I4_UNIFORM - Fatal error!\n");
    process.stdout.write("  Input value of SEED = 0.\n");
    throw "I4_UNIFORM - FATAL ERROR";
  }

  k = seed.val / 127773;

  seed.val = 16807 * ( seed.val - k * 127773 ) - k * 2836;

  if ( seed.val < 0 )
  {
    seed.val = seed.val + 2147483647;
  }

  r = ( seed.val ) * 4.656612875E-10;
//
//  Scale R to lie between A-0.5 and B+0.5.
//
  r = ( 1.0 - r ) * ( ( i4_min ( a, b ) ) - 0.5 )
    +         r   * ( ( i4_max ( a, b ) ) + 0.5 );
//
//  Use rounding to convert R to an integer between A and B.
//
  value = r4_nint ( r );

  value = i4_max ( value, i4_min ( a, b ) );
  value = i4_min ( value, i4_max ( a, b ) );

  return value;
}

function adj_print_some ( node_num, node_lo, node_hi, adj_num, adj_row, adj, title )
{
  var i;
  var j;
  var jhi;
  var jlo;
  var jmax;
  var jmin;

  process.stdout.write("\n");
  process.stdout.write(title + "\n");
  process.stdout.write("\n");
  process.stdout.write("  Sparse adjacency structure:\n");
  process.stdout.write("\n");
  process.stdout.write("  Number of nodes       = " + node_num + "\n");
  process.stdout.write("  Number of adjacencies = " + adj_num + "\n");
  process.stdout.write("\n");
  process.stdout.write("  Node Min Max      Nonzeros \n");
  process.stdout.write("\n");

  for ( i = node_lo; i <= node_hi; i++ )
  {
    jmin = adj_row[i-1];
    jmax = adj_row[i] - 1;

    if ( jmax < jmin )
    {
      process.stdout.write("  "  + i
           + "  "  + jmin
           + "  "  + jmax + "\n");
    }
    else
    {
      for ( jlo = jmin; jlo <= jmax; jlo = jlo + 5 )
      {
        jhi = i4_min ( jlo + 4, jmax );

        if ( jlo == jmin )
        {
          process.stdout.write("  "  + i
               + "  "  + jmin
               + "  "  + jmax
               + "   ");
          for ( j = jlo; j <= jhi; j++ )
          {
            cout  + adj[j-1];
          }
          process.stdout.write("\n");
        }
        else
        {
          process.stdout.write("                     ");
          for ( j = jlo; j <= jhi; j++ )
          {
            cout  + adj[j-1];
          }
          process.stdout.write("\n");
        }
      }
    }
  }

  return;
}

function adj_print ( node_num, adj_num, adj_row, adj, title )
{
  adj_print_some ( node_num, 1, node_num, adj_num, adj_row, adj, title );

  return;
}

function adj_show ( node_num, adj_num, adj_row, adj )
{
  var band;
  var band_lo;
  var col;
  var i;
  var j;
  var k;
  var nonzero_num;

  band = new Array(node_num);

  band_lo = 0;
  nonzero_num = 0;

  process.stdout.write("\n");
  process.stdout.write("  Nonzero structure of matrix:\n");
  process.stdout.write("\n");

  for ( i = 0; i < node_num; i++ )
  {
    for ( k = 0; k < node_num; k++ )
    {
      band[k] = '.';
    }

    band[i] = 'D';

    for ( j = adj_row[i]; j <= adj_row[i+1]-1; j++ )
    {
      col = adj[j-1] - 1;
      if ( col < i )
      {
        nonzero_num = nonzero_num + 1;
      }
      band_lo = max ( band_lo, i - col );
      band[col] = 'X';
    }
    process.stdout.write("  " + i + 1 + " ");
    for ( j = 0; j < node_num; j++ )
    {
      process.stdout.write(band[j]);
    }
    process.stdout.write("\n");
  }

  process.stdout.write("\n");
  process.stdout.write("  Lower bandwidth = " + band_lo + "\n");
  process.stdout.write("  Lower envelope contains " + nonzero_num + " nonzeros.\n");

  return;
}

function adj_bandwidth ( node_num, adj_num, adj_row, adj )
{
  int band_hi;
  int band_lo;
  int col;
  int i;
  int j;
  int value;

  band_lo = 0;
  band_hi = 0;

  for ( i = 0; i < node_num; i++ )
  {
    for ( j = adj_row[i]; j <= adj_row[i+1]-1; j++ )
    {
      col = adj[j-1] - 1;
      band_lo = i4_max ( band_lo, i - col );
      band_hi = i4_max ( band_hi, col - i );
    }
  }

  value = band_lo + 1 + band_hi;

  return value;
}

function genrcm ( node_num, adj_num, adj_row, adj, perm )
{
  var i;
  var iccsze = { val: 0 };
  var level_num = { val: 0 };
  var level_row;
  var mask;
  var num;
  var root = { val: 0 };

  level_row = new Array(node_num+1);
  mask = new Array(node_num);

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
      root_find ( root, adj_num, adj_row, adj, mask, level_num, level_row, perm+num-1, node_num );
//
//  RCM orders the component using ROOT as the starting node.
//
      rcm ( root, adj_num, adj_row, adj, mask, perm+num-1, iccsze, node_num );

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

//test1
module.exports.adj_set = adj_set;
module.exports.i4_uniform = i4_uniform;
module.exports.adj_print = adj_print;
module.exports.adj_show = adj_show;

//test2
module.exports.adj_bandwidth = adj_bandwidth;
module.exports.genrcm = genrcm;
module.exports.perm_inverse3 = perm_inverse3;
module.exports.adj_perm_show = adj_perm_show;
module.exports.adj_perm_bandwidth = adj_perm_bandwidth;
